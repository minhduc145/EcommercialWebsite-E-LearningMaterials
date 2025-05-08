package com.beee.Repository;

import com.beee.Model.CourseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface CourseRepo extends JpaRepository<CourseModel, Integer> {
	CourseModel findCourseModelById(Integer id);
}
