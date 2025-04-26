package com.beee.Service.Impl;

import com.beee.Common.Constants;
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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;

@Service
public class S3ServiceImpl {
	@Autowired
	private S3Client s3Client;

	@Autowired
	private S3Presigner s3Presigner;

	// Phương thức để upload file lên Cloudflare R2 hoặc S3
	@Async
	public void uploadFile(String bucketName, String key, MultipartFile multipartFile) throws IOException {
		// Tạo yêu cầu upload tệp
		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucketName)
				.key(key)
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
				.signatureDuration(Duration.ofMinutes(60))
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
}
