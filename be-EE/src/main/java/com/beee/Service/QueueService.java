package com.beee.Service;

import com.beee.Model.CourseFileModel;
import com.beee.Model.CourseModel;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface QueueService {
	public void processFileQueue(UUID fileId) throws Exception;

	public void deleteFileQueue(String prefix);

}
