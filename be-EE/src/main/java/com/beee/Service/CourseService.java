package com.beee.Service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CourseService {
	public List<Object[]> getStarRateCount(Integer courseId);
}
