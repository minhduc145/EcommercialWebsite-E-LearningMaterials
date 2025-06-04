package com.beee.Repository;

import com.beee.Model.CategoryModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Transactional
@Repository
public interface CategoryRepo extends JpaRepository<CategoryModel, Integer> {
	@Query(value = "SELECT \n" +
			"    categories.id as id,\n" +
			"    categories.name as name,\n" +
			"    categories.description as description,\n" +
			"    COUNT(courses.id) AS course_count\n" +
			"FROM categories\n" +
			"LEFT JOIN courses ON categories.id = courses.category_id\n" +
			"WHERE unaccent(categories.name) ILIKE unaccent(CONCAT('%', :keyword, '%'))\n" +
			"      OR unaccent(categories.description) ILIKE unaccent(CONCAT('%', :keyword, '%'))\n" +
			"GROUP BY categories.id, categories.name", nativeQuery = true)
	List<ArrayList<String>> getCategoriesAndCourseCount(String keyword, Sort sort);

	boolean existsByName(String name);

	CategoryModel findCategoryModelById(Integer id);
}
