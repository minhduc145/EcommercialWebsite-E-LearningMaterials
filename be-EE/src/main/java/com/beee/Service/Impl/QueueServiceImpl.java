package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Model.CourseContainerModel;
import com.beee.Model.CourseFileModel;
import com.beee.Model.CourseModel;
import com.beee.Repository.CourseFileRepo;
import com.beee.Repository.CourseRepo;
import com.beee.Service.FileService;
import com.beee.Service.QueueService;
import com.beee.Service.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
public class QueueServiceImpl implements QueueService {
	private final CourseRepo courseRepo;
	private final FileService fileService;
	private final CourseFileRepo courseFileRepo;
	private final S3Service s3Service;

	public QueueServiceImpl(CourseRepo courseRepo, FileService fileService, CourseFileRepo courseFileRepo, S3Service s3Service) {
		this.courseRepo = courseRepo;
		this.fileService = fileService;
		this.courseFileRepo = courseFileRepo;
		this.s3Service = s3Service;
	}

	@Override
	public void processFileQueue(CourseFileModel file, String containerId) throws Exception {
		String type = file.getType();
		CourseModel courseModel = courseRepo.findCourseModelById(courseRepo.findCourseIdByContainerId(UUID.fromString(containerId)));
		courseModel.setStatus(Constants.FILE_STATUS_PROCESSING);
		try {
			if (type.contains("scorm")) {
				String href = fileService.unzipAndGetHrefSCORM(file.getUrl(), containerId + "/" + file.getId());
				if (StringUtils.hasText(href)) {
					file.setUrl(containerId + "/" + file.getId() + "/" + Constants.PREFIX_BASE_UNZIPPED + "/" + href);
					file.setExtension("html");
				}
			} else if (type.contains("video")) {
				fileService.convertVideoFromR2ToHLS(file.getUrl(), containerId + "/" + file.getId());
				file.setUrl(containerId + "/" + file.getId() + "/" + Constants.HREF_HLS_INDEX);
				file.setType("media-hls");
				file.setExtension("m3u8");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (file != null) {
				file.setContainer(CourseContainerModel.builder().id(UUID.fromString(containerId)).build());
				courseFileRepo.save(file);
			}
			if (courseModel != null) {
				courseModel.setStatus(Constants.FILE_STATUS_DONE);
				courseRepo.save(courseModel);
			}
		}
	}

	@Override
	public void deleteFileQueue(String prefix) {
		s3Service.deleteFolderInParallel(prefix);
	}
}
