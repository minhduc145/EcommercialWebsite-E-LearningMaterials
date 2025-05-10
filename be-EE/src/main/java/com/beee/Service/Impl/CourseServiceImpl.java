package com.beee.Service.Impl;

import com.beee.Repository.ReviewRepo;
import com.beee.Service.CourseService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CourseServiceImpl implements CourseService {
	private final ReviewRepo reviewRepo;

	public CourseServiceImpl(ReviewRepo reviewRepo) {
		this.reviewRepo = reviewRepo;
	}

	@Override
	public List<Object[]> getStarRateCount(Integer courseId) {
		List<Object[]> results = reviewRepo.countEachStarRateByCourseId(courseId);
		Map<Integer, Long> rateCountMap = new HashMap<>();
		for (Object[] row : results) {
			Integer star = (Integer) row[0];
			Long count = (Long) row[1];
			rateCountMap.put(star, count);
		}
		List<Object[]> fullResults = new ArrayList<>();
		for (int i = 5; i >= 1; i--) {
			Object[] row = new Object[2];
			row[0] = i;
			row[1] = rateCountMap.getOrDefault(i, 0L);
			fullResults.add(row);
		}
		return fullResults;
	}

}
