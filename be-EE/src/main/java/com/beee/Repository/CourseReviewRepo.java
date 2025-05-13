package com.beee.Repository;

import com.beee.Model.CourseReviewModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Transactional
@Repository
public interface CourseReviewRepo extends JpaRepository<CourseReviewModel, Integer> {
	CourseReviewModel getCourseReviewModelById(Integer id);
}
