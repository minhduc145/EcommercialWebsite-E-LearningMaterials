package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Model.CourseFileModel;
import com.beee.Service.FileService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.S3Service;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Component
public class FileServiceImpl implements FileService {
	private final S3Client s3Client;
	private final S3Service s3Service;
	private final RabbitMQProducer rabbitMQProducer;

	public FileServiceImpl(S3Client s3Client, S3Service s3Service, RabbitMQProducer rabbitMQProducer) {
		this.s3Client = s3Client;
		this.s3Service = s3Service;
		this.rabbitMQProducer = rabbitMQProducer;
	}

	public ResponseInputStream<GetObjectResponse> safeGetObjectWithRetry(String key) throws IOException {
		long millis = 1000;
		GetObjectRequest request = GetObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.build();
		for (int i = 0; i < 5; i++) {
			try {
				return s3Client.getObject(request);
			} catch (NoSuchKeyException e) {
				try {
					Thread.sleep(millis);
					millis += 500;
				} catch (InterruptedException ignored) {
				}
			}
		}
		throw new IOException("File not found in R2 after 6 attempts: " + key);
	}

	public void convertVideoFromR2ToHLS(String fileKey, String outDir) throws IOException, InterruptedException {
		ResponseInputStream<GetObjectResponse> videoInputStream = safeGetObjectWithRetry(fileKey);
		Path hlsOutputDir = Files.createTempDirectory("hls_output_");
		Path m3u8Path = hlsOutputDir.resolve("index.m3u8");
		ProcessBuilder pb = new ProcessBuilder(
				"ffmpeg",
				"-hwaccel", "qsv",             // Sử dụng tăng tốc phần cứng Intel Quick Sync
				"-i", "pipe:0",                // Input từ stdin
				"-c:v", "h264_qsv",           // Encoder GPU của Intel
				"-preset", "veryfast",        // Ưu tiên tốc độ encode (có thể dùng faster/veryfast/superfast/ultrafast)
				"-global_quality", "20",       // Chất lượng (thấp hơn = nhanh hơn, thường 18-28)
				"-look_ahead", "0",           // Tắt look-ahead để tăng tốc
				"-c:a", "aac",                 // Audio vẫn dùng CPU
				"-f", "hls",                   // Format output là HLS
				"-hls_time", "30",             // Mỗi segment dài 20 giây
				"-hls_playlist_type", "vod",
				m3u8Path.toString()
		);
		pb.redirectErrorStream(true);
		Process process = pb.start();
		new Thread(() -> {
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String line;
				while ((line = reader.readLine()) != null) {
					System.out.println("[FFMPEG] " + line);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}).start();
		try (OutputStream ffmpegInput = process.getOutputStream()) {
			byte[] buffer = new byte[8192];
			int len;
			while ((len = videoInputStream.read(buffer)) != -1) {
				ffmpegInput.write(buffer, 0, len);
			}
		}
		int exitCode = process.waitFor();
		if (exitCode != 0) {
			throw new RuntimeException("FFmpeg exited with code " + exitCode);
		}
		try (Stream<Path> fileStream = Files.walk(hlsOutputDir)) {
			fileStream
					.filter(Files::isRegularFile)
					.forEach(path -> {
						String fileName = path.getFileName().toString();
						String uploadKey = StringUtils.hasText(outDir) ? outDir + "/hls/" + fileName : "hls/" + fileName;
						try (InputStream is = Files.newInputStream(path)) {
							String contentType = Files.probeContentType(path);
							if (contentType == null) contentType = "application/octet-stream";
							s3Service.uploadStreamViaSignedUrl(is, contentType, uploadKey);
						} catch (Exception e) {
							throw new RuntimeException("Upload failed for file: " + fileName, e);
						}
					});
		}
		FileUtils.deleteDirectory(hlsOutputDir.toFile());
	}

	public String getScormEntryHref(InputStream manifestStream) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setNamespaceAware(true);
		Document doc = factory.newDocumentBuilder().parse(manifestStream);
		XPathFactory xPathFactory = XPathFactory.newInstance();
		XPath xpath = xPathFactory.newXPath();
		XPathExpression expr = xpath.compile("/*[local-name()='manifest']/*[local-name()='resources']/*[local-name()='resource'][1]/@href");
		return (String) expr.evaluate(doc, XPathConstants.STRING);
	}

	public String unzipAndGetHrefSCORM(String fileKey, String outDir) throws Exception {
		String href = "";
		ExecutorService executor = Executors.newFixedThreadPool(8);
		List<CompletableFuture<Void>> uploadFutures = new ArrayList<>();
		try (ResponseInputStream<GetObjectResponse> s3InputStream = safeGetObjectWithRetry(fileKey);
		     ZipInputStream zipInputStream = new ZipInputStream(s3InputStream)) {
			ZipEntry entry;
			while ((entry = zipInputStream.getNextEntry()) != null) {
				if (entry.isDirectory()) continue;
				final String entryName = entry.getName();
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				byte[] buffer = new byte[8192];
				int len;
				while ((len = zipInputStream.read(buffer)) != -1) {
					baos.write(buffer, 0, len);
				}
				byte[] entryBytes = baos.toByteArray();

				if (entryName.equalsIgnoreCase("imsmanifest.xml")) {
					try (InputStream manifestStream = new ByteArrayInputStream(entryBytes)) {
						href = getScormEntryHref(manifestStream);
					}
				}

				CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
					try (InputStream is = new ByteArrayInputStream(entryBytes)) {
						String objectKey = StringUtils.hasText(outDir) ? outDir + "/unzipped/" + entryName : "unzipped/" + entryName;
						String contentType = Files.probeContentType(Paths.get(entryName));
						if (contentType == null) contentType = "application/octet-stream";
						s3Service.uploadStreamViaSignedUrl(is, contentType, objectKey);
					} catch (Exception e) {
						throw new RuntimeException("Upload failed for: " + entryName, e);
					}
				}, executor);
				uploadFutures.add(future);
				zipInputStream.closeEntry();
			}
			CompletableFuture.allOf(uploadFutures.toArray(new CompletableFuture[0])).join();
			executor.shutdown();
		}
		return href;
	}

	public boolean isImage(MultipartFile file) {
		return file.getContentType().startsWith("image/");
	}

	@Override
	public void processFileInQueue(CourseFileModel courseFileModel, String containerId) {
		String type = courseFileModel.getType();
		String ex = courseFileModel.getExtension();
		Map map = new HashMap();
		map.put("command", Constants.QUEUE_FILE_COMMAND_PROCESS);
		map.put("fileModel", courseFileModel);
		map.put("containerId", containerId);
		if ((type.contains("video") && ex.contains("mp4"))
				|| (type.contains("scorm") && ex.contains("zip"))) {
			rabbitMQProducer.sendToFileProcessQueue(map);
		}
	}

	@Override
	public void deleteFileInQueue(String prefix) {
		Map map = new HashMap();
		map.put("command", Constants.QUEUE_FILE_COMMAND_DELETE);
		map.put("prefix", prefix);
		rabbitMQProducer.sendToFileProcessQueue(map);
	}

}
