package com.beee.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class S3ServiceImpl {
	@Autowired
	private S3Client s3Client;

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
			// Upload tệp lên Cloudflare R2 (hoặc S3)
			s3Client.putObject(putObjectRequest, tempFile);

		} finally {
			// Xoá tệp tạm sau khi upload
			Files.delete(tempFile);
		}
	}
}
