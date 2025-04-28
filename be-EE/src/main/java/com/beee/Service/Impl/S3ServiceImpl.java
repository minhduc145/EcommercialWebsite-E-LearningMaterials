package com.beee.Service.Impl;

import com.beee.Common.Constants;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class S3ServiceImpl {
	@Autowired
	private S3Client s3Client;

	@Autowired
	private S3Presigner s3Presigner;

	// Phương thức để upload file lên Cloudflare R2 hoặc S3
	@Async
	public void uploadFile(String bucketName, String key, MultipartFile multipartFile) throws IOException {
		String fileKey = UUID.randomUUID().toString();
		// Tạo yêu cầu upload tệp
		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucketName)
				.key(fileKey + "/" + key)
				.build();

		// Chuyển MultipartFile thành tệp tạm để upload
		Path tempFile = Files.createTempFile("upload", multipartFile.getOriginalFilename());
		Files.copy(multipartFile.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
		try {
			s3Client.putObject(putObjectRequest, tempFile);
		} finally {
			Files.delete(tempFile);
		}
	}

	public String generatePresignedUploadUrl(String objectKey) {
		PutObjectRequest putRequest = PutObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(objectKey)
				.build();

		return s3Presigner.presignPutObject(builder -> builder
				.signatureDuration(Duration.ofMinutes(10))
				.putObjectRequest(putRequest)
		).url().toString();
	}

	public String generatePresignedUrl(String key) {
		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.build();
		GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
				.signatureDuration(Duration.ofMinutes(30))
				.getObjectRequest(getObjectRequest)
				.build();
		PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
		return presignedRequest.url().toString();
	}

	public void deleteObject(String key) {
		DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.build();
		DeleteObjectResponse response = s3Client.deleteObject(deleteRequest);
		System.out.println("Deleted: " + key);
	}

	public String convertMp4StreamToHlsAndUploadReturnM3u8Url(String mp4Url, String s3BasePath, S3Client s3Client, S3Presigner s3Presigner) throws IOException, InterruptedException {
		Path tempDir = Files.createTempDirectory("hls_output");

		ProcessBuilder builder = new ProcessBuilder(
				"ffmpeg",
				"-i", "-",
				"-c:v", "copy",
				"-c:a", "aac", "-strict", "experimental",
				"-f", "hls",
				"-hls_time", "10",
				"-hls_playlist_type", "vod",
				tempDir.resolve("index.m3u8").toString()
		);

		builder.redirectErrorStream(true);
		Process process = builder.start();

		URI uri = URI.create(mp4Url);
		URL url = uri.toURL();
		try (InputStream mp4Stream = url.openStream();
		     OutputStream ffmpegInput = process.getOutputStream()) {
			mp4Stream.transferTo(ffmpegInput);
		}

		int exitCode = process.waitFor();
		if (exitCode != 0) {
			throw new RuntimeException("Failed to convert mp4 to HLS, exit code: " + exitCode);
		}

		try (Stream<Path> files = Files.walk(tempDir)) {
			files.filter(Files::isRegularFile).forEach(filePath -> {
				String filename = filePath.getFileName().toString();
				String s3Key = s3BasePath + "/" + filename;

				try {
					s3Client.putObject(PutObjectRequest.builder()
									.bucket(Constants.CLOUD_BUCKET_NAME)
									.key(s3Key)
									.contentType(Files.probeContentType(filePath))
									.build(),
							filePath
					);
					System.out.println("Uploaded to S3: " + s3Key);
				} catch (IOException e) {
					throw new RuntimeException("Failed to upload file " + filename, e);
				}
			});
		}

		FileUtils.deleteDirectory(new File(""));

		// Trả URL public cho file index.m3u8
		return generatePresignedUrl(s3BasePath + "/index.m3u8");
	}
}
