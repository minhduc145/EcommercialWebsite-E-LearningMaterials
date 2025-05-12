package com.beee.Repository;

import com.beee.DTO.CourseBasicResDTO;
import com.beee.Model.CourseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Transactional
@Repository
public interface CourseRepo extends JpaRepository<CourseModel, Integer> {

	@Query(value = "SELECT DISTINCT course_id FROM containers WHERE id = :id", nativeQuery = true)
	Integer findCourseIdByContainerId(@Param("id") UUID containerId);

	CourseModel findCourseModelById(Integer id);

	boolean existsByCreator_Id(String creatorId);

	boolean existsByIdAndCreator_Id(Integer id, String creatorId);

	@Query(value = "SELECT c.id, c.title, c.price,c.thumbnail_url, c2.\"name\" as category_name, COUNT(cr.course_id) AS comment_count, ROUND(AVG(cr.star_rate), 1) AS average_rating\n" +
			"FROM courses c\n" +
			"LEFT JOIN course_reviews cr ON cr.course_id = c.id inner join categories c2 on c2.id = c.category_id\n" +
			"where c.is_available = true\n" +
			"GROUP BY c.id, c2.id\n" +
			"ORDER BY c.created_at desc;", nativeQuery = true)
	List<Map> findAllByIsFeaturedTrue();

}
