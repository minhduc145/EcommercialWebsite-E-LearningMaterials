package com.beee.Service;

import com.beee.Model.CourseFileModel;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public interface FileService {
	public void convertVideoFromR2ToHLS(String fileKey, String outDir);

	public void unzipAndUploadStream(String fileKey, String outDir);

	public boolean isImage(MultipartFile file);

	public void addFileToProcessQueue(CourseFileModel courseFileModel, String containerId);
}
