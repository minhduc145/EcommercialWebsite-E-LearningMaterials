package com.beee.Repository;

import com.beee.Model.CourseContainerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
@Transactional
@Repository
public interface CourseContainerRepo extends JpaRepository<CourseContainerModel, UUID> {
	List<CourseContainerModel> findAllByCourse_Id(Integer courseId);

	List<CourseContainerModel> findAllByCourse_IdOrderByCreatedAtAsc(Integer id);

}
