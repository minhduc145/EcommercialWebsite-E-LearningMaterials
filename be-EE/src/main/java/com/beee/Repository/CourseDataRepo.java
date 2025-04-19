package com.beee.Repository;

import com.beee.Model.CourseContainerModel;
import com.beee.Model.CourseDataModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseDataRepo extends JpaRepository<CourseDataModel, Long> {
	List<CourseDataModel> findAllByCourse_Id(Integer courseId);
}
