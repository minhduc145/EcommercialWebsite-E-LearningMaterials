package com.beee.Service;

import com.beee.Model.CourseFileModel;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public interface FileService {
	public void convertVideoFromR2ToHLS(String fileKey, String outDir) throws IOException, InterruptedException;

	public String unzipAndGetHrefSCORM(String fileKey, String outDir) throws Exception;

	public boolean isImage(MultipartFile file);

	public void processFileInQueue(CourseFileModel courseFileModel, String containerId);

	public void deleteFileInQueue(String prefix);
}
