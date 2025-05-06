package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Service.Impl.S3ServiceImpl;
import com.beee.Service.RabbitMQProducer;
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
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

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
	public ResponseEntity<?> unzipAndUploadStream(@RequestParam String zipFileKey) {
		try {
			GetObjectRequest getRequest = GetObjectRequest.builder()
					.bucket(Constants.CLOUD_BUCKET_NAME)
					.key(zipFileKey)
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
						PutObjectRequest putRequest = PutObjectRequest.builder()
								.bucket(Constants.CLOUD_BUCKET_NAME)
								.key("unzipped/" + entryName)
								.contentLength((long) entryBytes.length)
								.build();
						s3Client.putObject(putRequest, RequestBody.fromBytes(entryBytes));
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

	public void convertMp4ToHls(Path inputMp4, Path outputDir) throws IOException, InterruptedException {
		Files.createDirectories(outputDir);

		List<String> command = List.of(
				"ffmpeg",
				"-i", inputMp4.toString(),
				"-codec:", "copy",
				"-start_number", "0",
				"-hls_time", "10",
				"-hls_list_size", "0",
				"-f", "hls",
				outputDir.resolve("output.m3u8").toString()
		);

		ProcessBuilder pb = new ProcessBuilder(command);
		pb.redirectErrorStream(true);
		Process process = pb.start();

		// In log ffmpeg (tuỳ chọn)
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
			String line;
			while ((line = reader.readLine()) != null) {
				System.out.println(line);
			}
		}

		int exitCode = process.waitFor();
		if (exitCode != 0) throw new RuntimeException("ffmpeg failed with code " + exitCode);
	}

	public void streamMp4ToHls(String inputFileKey, OutputStream outputStream) throws IOException, InterruptedException {
		// Lấy stream từ Cloudflare R2
		GetObjectRequest getRequest = GetObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(inputFileKey)
				.build();

		ResponseInputStream<GetObjectResponse> s3InputStream = s3Client.getObject(getRequest);

		// Tạo lệnh ffmpeg để stream video từ InputStream vào m3u8
		List<String> command = List.of(
				"ffmpeg",
				"-i", "pipe:0",       // Nhận đầu vào từ stdin (sử dụng "pipe:0")
				"-codec:", "copy",
				"-start_number", "0",
				"-hls_time", "10",
				"-hls_list_size", "0",
				"-f", "hls",
				"pipe:1"              // Gửi kết quả HLS ra stdout (output stream)
		);

		ProcessBuilder pb = new ProcessBuilder(command);
		pb.redirectErrorStream(true);
		Process process = pb.start();

		// Gửi dữ liệu từ s3InputStream vào stdin của ffmpeg
		new Thread(() -> {
			try (OutputStream ffmpegInputStream = process.getOutputStream()) {
				byte[] buffer = new byte[8192];
				int len;
				while ((len = s3InputStream.read(buffer)) != -1) {
					ffmpegInputStream.write(buffer, 0, len);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}).start();

		// Đọc dữ liệu từ stdout của ffmpeg (playlist m3u8 và ts segments)
		try (InputStream ffmpegOutputStream = process.getInputStream()) {
			byte[] buffer = new byte[8192];
			int len;
			while ((len = ffmpegOutputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, len);
			}
		}

		int exitCode = process.waitFor();
		if (exitCode != 0) {
			throw new RuntimeException("ffmpeg failed with exit code " + exitCode);
		}
	}

	public void convertAndUploadToR2(String inputFileKey, String outputDirPath) throws IOException, InterruptedException {
		// Lấy video MP4 từ Cloudflare R2
		GetObjectRequest getRequest = GetObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(inputFileKey)
				.build();

		ResponseInputStream<GetObjectResponse> s3InputStream = s3Client.getObject(getRequest);

		// Chạy ffmpeg để chuyển đổi video MP4 thành HLS (M3U8 và TS)
		List<String> command = List.of(
				"ffmpeg",
				"-i", "pipe:0",   // Nhận dữ liệu từ stdin
				"-c:v", "copy",    // Đảm bảo mã hóa video (với codec copy)
				"-start_number", "0",
				"-hls_time", "10",  // Thời gian mỗi segment TS
				"-hls_list_size", "0",  // Không giới hạn số lượng file trong playlist
				"-f", "hls",
				"pipe:1"            // Gửi kết quả ra stdout
		);

		ProcessBuilder pb = new ProcessBuilder(command);
		pb.redirectErrorStream(true);
		Process process = pb.start();

		// Gửi dữ liệu từ R2 vào ffmpeg
		new Thread(() -> {
			try (OutputStream ffmpegInputStream = process.getOutputStream()) {
				byte[] buffer = new byte[8192];
				int len;
				while ((len = s3InputStream.read(buffer)) != -1) {
					ffmpegInputStream.write(buffer, 0, len);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}).start();

		// Đọc dữ liệu từ stdout của ffmpeg và upload lại lên Cloudflare R2
		try (InputStream ffmpegOutputStream = process.getInputStream()) {
			byte[] buffer = new byte[8192];  // Có thể thay đổi kích thước buffer nếu cần
			int len;
			while ((len = ffmpegOutputStream.read(buffer)) != -1) {
				// Gửi từng phần dữ liệu ra R2 (M3U8 hoặc TS)
				uploadToR2(buffer, len);
			}
		}

		int exitCode = process.waitFor();
		if (exitCode != 0) {
			throw new RuntimeException("ffmpeg failed with exit code " + exitCode);
		}
	}


	// Upload dữ liệu từ ffmpeg lên R2
	private void uploadToR2(byte[] buffer, int length) throws IOException {
		// Xác định key cho các file (M3U8 hoặc TS)
		String key = "hls/" + System.currentTimeMillis() + ".ts";  // Ví dụ: lưu theo timestamp

		PutObjectRequest putRequest = PutObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.contentLength((long) length)
				.build();

		try (InputStream inputStream = new ByteArrayInputStream(buffer, 0, length)) {
			s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, length));
			System.out.println("Uploaded: " + key);
		}
	}

	@PostMapping("/convert-mp4")
	public ResponseEntity convertVideo(@RequestParam String filekey, @RequestParam String outDir) throws IOException, InterruptedException {
		convertAndUploadToR2(filekey, outDir);
		return ResponseEntity.ok().build();
	}


}
