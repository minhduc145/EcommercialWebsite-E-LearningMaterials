package com.beee.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface FileService {
	public void convertVideoFromR2ToHLS(String fileKey) throws IOException, InterruptedException;

	public void unzipAndUploadStream(String fileKey) throws IOException;

	public boolean isImage(MultipartFile file);

}
