package com.beee.Repository;

import com.beee.Model.CourseReviewModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Transactional
@Repository
public interface ReviewRepo extends JpaRepository<CourseReviewModel, Integer> {
	Page findCourseReviewModelsByCourse_IdOrderByCreatedAtDesc(Integer courseId, PageRequest pageRequest);

	@Query("SELECT SUM(r.starRate) FROM CourseReviewModel r WHERE r.course.id = :courseId")
	Long sumAllStarsByCourse_Id(Integer courseId);

	@Query("SELECT AVG(r.starRate) FROM CourseReviewModel r WHERE r.course.id = :courseId")
	Float averageStarsByCourse_Id(Integer courseId);

	@Query("SELECT r.starRate, COUNT(r) FROM CourseReviewModel r WHERE r.course.id = :courseId GROUP BY r.starRate order by r.starRate desc")
	List<Object[]> countEachStarRateByCourseId(@Param("courseId") Integer courseId);
}
