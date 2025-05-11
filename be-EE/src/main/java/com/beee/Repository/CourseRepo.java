package com.beee.Repository;

import com.beee.Model.CourseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Transactional
@Repository
public interface CourseRepo extends JpaRepository<CourseModel, Integer> {

	@Query(value = "SELECT DISTINCT course_id FROM containers WHERE id = :id", nativeQuery = true)
	Integer findCourseIdByContainerId(@Param("id") UUID containerId);

	CourseModel findCourseModelById(Integer id);

	boolean existsByCreator_Id(String creatorId);

	boolean existsByIdAndCreator_Id(Integer id, String creatorId);
}
