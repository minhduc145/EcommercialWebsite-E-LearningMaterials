package com.beee.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public interface S3Service {
	public void uploadFileSDK(File file, String key);

	public void uploadFileViaSignedUrl(MultipartFile file, String objectKey) throws IOException;

	public void uploadStreamViaSignedUrl(InputStream inputStream, String contentType, String objectKey) throws IOException;

	public String generatePresignedUploadUrl(String objectKey);

	public String generatePresignedUploadUrl(String objectKey, long min);

	public String generatePresignedUrl(String key);

	public void deleteObject(String key);

	public void deleteFolderInParallel(String prefix);
}
