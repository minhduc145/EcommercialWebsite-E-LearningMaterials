package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Service.S3Service;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;

@Service
public class S3ServiceImpl implements S3Service {
	@Autowired
	private S3Client s3Client;

	@Autowired
	private S3Presigner s3Presigner;

	public void uploadFileSDK(File file, String key) {
		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.build();
		s3Client.putObject(putObjectRequest, RequestBody.fromFile(file));
	}

	public void uploadFileViaSignedUrl(MultipartFile file, String objectKey) throws IOException {
		try (InputStream is = file.getInputStream()) {
			uploadStreamViaSignedUrl(is, file.getContentType(), objectKey);
		}
	}

	public void uploadStreamViaSignedUrl(InputStream inputStream, String contentType, String objectKey) throws IOException {
		String signedUrl = generatePresignedUploadUrl(objectKey);
		HttpURLConnection connection = (HttpURLConnection) new URL(signedUrl).openConnection();
		connection.setDoOutput(true);
		connection.setRequestMethod("PUT");
		connection.setRequestProperty("Content-Type", contentType);
		try (OutputStream os = connection.getOutputStream()) {
			byte[] buffer = new byte[8192];
			int bytesRead;
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				os.write(buffer, 0, bytesRead);
			}
		}
		int responseCode = connection.getResponseCode();
		if (responseCode != 200) {
			throw new RuntimeException("Upload failed with HTTP code: " + responseCode);
		}
	}

	public String generatePresignedUploadUrl(String objectKey) {
		return generatePresignedUploadUrl(objectKey, 1);
	}

	public String generatePresignedUploadUrl(String objectKey, long min) {
		PutObjectRequest putRequest = PutObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(objectKey)
				.build();

		return s3Presigner.presignPutObject(builder -> builder
				.signatureDuration(Duration.ofMinutes(min))
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
		s3Client.deleteObject(DeleteObjectRequest.builder()
				.bucket(Constants.CLOUD_BUCKET_NAME)
				.key(key)
				.build());
		System.out.println("Deleted: " + key);
	}

	public void deleteFolderInParallel(String prefix) {
		ExecutorService executor = Executors.newFixedThreadPool(8);
		List<CompletableFuture<Void>> deleteFutures = new ArrayList<>();
		String continuationToken = null;
		try {
			do {
				var listRequestBuilder = ListObjectsV2Request.builder()
						.bucket(Constants.CLOUD_BUCKET_NAME)
						.prefix(prefix)
						.maxKeys(1000);
				if (continuationToken != null) {
					listRequestBuilder.continuationToken(continuationToken);
				}
				var listResponse = s3Client.listObjectsV2(listRequestBuilder.build());
				for (var object : listResponse.contents()) {
					var key = object.key();
					deleteFutures.add(CompletableFuture.runAsync(() -> {
						deleteObject(key);
					}, executor));
				}
				continuationToken = listResponse.nextContinuationToken();
			} while (continuationToken != null);
			CompletableFuture.allOf(deleteFutures.toArray(new CompletableFuture[0])).join();
		} finally {
			executor.shutdown();
		}
	}
}
