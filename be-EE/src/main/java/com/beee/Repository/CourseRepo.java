package com.beee.Repository;

import com.beee.Model.CourseModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepo extends JpaRepository<CourseModel, Integer> {
}
