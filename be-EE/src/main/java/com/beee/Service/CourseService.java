package com.beee.Service;

import com.beee.DTO.CourseContainerRequestDTO;
import com.beee.DTO.CourseFileReqDTO;
import com.beee.Model.CourseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@Service
public interface CourseService {
	List<Object[]> getStarRateCount(Integer courseId);

	ResponseEntity getCourseData(Integer id);
	ResponseEntity getCourseDataWithUrl(String userToken, Integer id);
	ResponseEntity addCourseInfo(String userToken, CourseModel courseModel, MultipartFile bannerFile) throws IOException;
	ResponseEntity deleteCourses(String userToken, List<String> params);

	ResponseEntity addCourseDataContainer(String userToken, CourseContainerRequestDTO courseContainerRequestDTO);
	ResponseEntity addCourseDataFile(String userToken, CourseFileReqDTO courseFileReqDTO);

	ResponseEntity isSubscribedByUserAndCourse(String userToken, String courseId);
	ResponseEntity getSubscriptionSummary(String username, String courseId);

}