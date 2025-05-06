package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Service.Impl.S3ServiceImpl;
import com.beee.Service.RabbitMQProducer;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/files")
public class FilesController {
	@Autowired
	private S3ServiceImpl s3Service;
	@Autowired
	private S3ServiceImpl s3ServiceImpl;
	@Autowired
	private RabbitMQProducer rabbitMQProducer;
	@Autowired
	private S3Client s3Client;

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			String newFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			s3Service.uploadFileViaSignedUrl(file, newFileName);
			return ResponseEntity.ok("File uploaded successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteFile(@CookieValue(name = "jwt", required = false) String token, String fileKey) {
		try {
			System.out.println(fileKey);
			s3Service.deleteObject(fileKey);
			return ResponseEntity.ok("File deleted successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("File deleted failed: " + e.getMessage());
		}
	}

	@GetMapping("/getSigned")
	public ResponseEntity getSignedUrl(@CookieValue(name = "jwt", required = false) String token, @RequestParam String fileKey) {
		String signedUrl = s3ServiceImpl.generatePresignedUrl(fileKey);
		return ResponseEntity.ok(signedUrl);
	}

	@PostMapping("/process")
	public ResponseEntity processFile() {
		Map map = new HashMap();
		map.put("file", 1);
		rabbitMQProducer.sendToFileProcessQueue(map);
		rabbitMQProducer.sendToQ1("jhiafhsdf", "kdfgshjdf");
		return ResponseEntity.ok().build();
	}

	@PostMapping("/unzip-and-upload-stream")
	public ResponseEntity<?> unzipAndUploadStream(@RequestParam String fileKey) {
		try {
			GetObjectRequest getRequest = GetObjectRequest.builder()
					.bucket(Constants.CLOUD_BUCKET_NAME)
					.key(fileKey)
					.build();

			ExecutorService executor = Executors.newFixedThreadPool(4); // tối đa 4 file upload song song
			List<CompletableFuture<Void>> uploadFutures = new ArrayList<>();

			try (ResponseInputStream<GetObjectResponse> s3InputStream = s3Client.getObject(getRequest);
			     ZipInputStream zipInputStream = new ZipInputStream(s3InputStream)) {

				ZipEntry entry;
				while ((entry = zipInputStream.getNextEntry()) != null) {
					if (entry.isDirectory()) continue;

					final String entryName = entry.getName();
					final long entrySize = entry.getSize();

					// Copy nội dung entry thành byte[] để stream độc lập
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					byte[] buffer = new byte[8192];
					int len;
					while ((len = zipInputStream.read(buffer)) != -1) {
						baos.write(buffer, 0, len);
					}
					byte[] entryBytes = baos.toByteArray();

					// Submit upload task song song
					CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
						try (InputStream is = new ByteArrayInputStream(entryBytes)) {
							String objectKey = "unzipped/" + entryName;
							String contentType = Files.probeContentType(Paths.get(entryName));
							if (contentType == null) contentType = "application/octet-stream";
							s3ServiceImpl.uploadStreamViaSignedUrl(is, contentType, objectKey);
						} catch (Exception e) {
							throw new RuntimeException("Upload failed for: " + entryName, e);
						}
					}, executor);

					uploadFutures.add(future);

					zipInputStream.closeEntry(); // quan trọng
				}

				// Đợi tất cả upload xong
				CompletableFuture.allOf(uploadFutures.toArray(new CompletableFuture[0])).join();
				executor.shutdown();

				return ResponseEntity.ok("Upload song song thành công!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
		}
	}


	@PostMapping("/convert-mp4")
	public void convertVideoFromR2ToHLS(@RequestParam String fileKey) throws IOException, InterruptedException {
		GetObjectRequest getRequest = GetObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(fileKey)
				.build();
		ResponseInputStream<GetObjectResponse> videoInputStream = s3Client.getObject(getRequest);

		Path hlsOutputDir = Files.createTempDirectory("hls_output_");
		Path m3u8Path = hlsOutputDir.resolve("index.m3u8");

		ProcessBuilder pb = new ProcessBuilder(
				"ffmpeg",
				"-hwaccel", "qsv",             // Sử dụng tăng tốc phần cứng Intel Quick Sync
				"-i", "pipe:0",                // Input từ stdin
				"-c:v", "h264_qsv",           // Encoder GPU của Intel
				"-preset", "veryfast",        // Ưu tiên tốc độ encode (có thể dùng faster/veryfast/superfast/ultrafast)
				"-global_quality", "23",       // Chất lượng (thấp hơn = nhanh hơn, thường 18-28)
				"-look_ahead", "0",           // Tắt look-ahead để tăng tốc
				"-c:a", "aac",                 // Audio vẫn dùng CPU
				"-f", "hls",                   // Format output là HLS
				"-hls_time", "20",             // Mỗi segment dài 20 giây
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
						String uploadKey = "hls/" + fileName;

						try (InputStream is = Files.newInputStream(path)) {
							String contentType = Files.probeContentType(path);
							if (contentType == null) contentType = "application/octet-stream";
							s3ServiceImpl.uploadStreamViaSignedUrl(is, contentType, uploadKey);
						} catch (Exception e) {
							throw new RuntimeException("Upload failed for file: " + fileName, e);
						}
					});
		}

		FileUtils.deleteDirectory(hlsOutputDir.toFile());
	}



	@DeleteMapping("/deletePrefix")
	public ResponseEntity deletePrefix(@RequestParam String prefix) throws IOException, InterruptedException {
		s3ServiceImpl.deleteFolderInParallel(prefix);
		return ResponseEntity.ok().build();
	}


}
