package com.beee.Service;

import com.beee.Model.CourseFileModel;
import com.beee.Model.CourseModel;
import org.springframework.stereotype.Service;

@Service
public interface QueueService {
	public void processFileQueue(CourseFileModel file, CourseModel courseModel, String containerId) throws Exception;

	public void deleteFileQueue(String prefix);

}
