package com.beee.Repository;

import com.beee.Model.CourseFileModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Transactional
@Repository
public interface CourseFileRepo extends JpaRepository<CourseFileModel, UUID> {
	boolean findCourseFileModelById(UUID id);
}
