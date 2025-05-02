package com.beee.Repository;

import com.beee.Model.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface CategoryRepo extends JpaRepository<CategoryModel, Integer> {
	@Query(value = "SELECT \n" +
			"    categories.id,\n" +
			"    categories.name,\n" +
			"    categories.description,\n" +
			"    COUNT(courses.id) AS course_count\n" +
			"FROM \n" +
			"    categories\n" +
			"LEFT JOIN \n" +
			"    courses ON categories.id = courses.category_id\n" +
			"GROUP BY \n" +
			"    categories.id, categories.name", nativeQuery = true)
	List<ArrayList<String>> getCategoriesAndCourseCount();
}
