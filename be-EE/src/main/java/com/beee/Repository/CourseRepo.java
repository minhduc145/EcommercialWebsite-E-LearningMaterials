package com.beee.Repository;

import com.beee.DTO.CourseBasicResDTO;
import com.beee.Model.CourseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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

	@Query(value = searchCourseUserQuerySelectString +
			"where c.is_available = true and c.is_featured = true\n" +
			"GROUP BY c.id, c2.id\n" +
			"ORDER BY c.created_at desc;", nativeQuery = true)
	List<Map> findAllByIsFeaturedTrue();

	@Query(value = "SELECT c.* \n" +
			"        FROM courses c \n" +
			"        JOIN users u ON c.creator_id = u.id \n" +
			"        JOIN categories cat ON c.category_id = cat.id \n" +
			"        WHERE unaccent(c.title) ILIKE unaccent(CONCAT('%', :keyword, '%')) \n" +
			"           OR unaccent(cat.name) ILIKE unaccent(CONCAT('%', :keyword, '%'))\n" +
			"           OR unaccent(u.first_name) ILIKE unaccent(CONCAT('%', :keyword, '%'))\n" +
			"           OR unaccent(u.last_name) ILIKE unaccent(CONCAT('%', :keyword, '%'))", nativeQuery = true)
	Page<CourseModel> getCoursesWithQueryParams(String keyword, Pageable pageable);

	CourseModel findTopByOrderByPriceDesc();

	String searchCourseUserQuerySelectString = """
			SELECT c.id, c.title, c.price,c.thumbnail_url, c2."name" as category_name, c.is_featured as is_featured, COUNT(cr.course_id) AS comment_count, ROUND(AVG(cr.star_rate), 1) AS average_rating
			FROM courses c LEFT JOIN course_reviews cr ON cr.course_id = c.id inner join categories c2 on c2.id = c.category_id\n
			""";

	String searchCourseWhereString = """
			\nWHERE (unaccent(lower(c.title)) LIKE unaccent(lower(CONCAT('%', :title, '%'))))
			AND (c.price BETWEEN :price1 and :price2)
			AND date(c.created_at) >=:dateStart
			AND date(c.created_at) <= :dateEnd
			AND c.is_available = true
			AND (:takeFeatures = false OR c.is_featured = true)\n
			""";
	String searchCourseGroupbyString = "\nGROUP BY c.id, c2.id\n";

	@Query(value = searchCourseUserQuerySelectString + searchCourseWhereString + "AND c.category_id in (:categories)" + searchCourseGroupbyString, nativeQuery = true)
	Page<Map> searchCourseUser(
			@Param("title") String title,
			@Param("categories") List<String> categories,
			@Param("price1") BigDecimal price1,
			@Param("price2") BigDecimal price2,
			@Param("dateStart") LocalDate dateStart,
			@Param("dateEnd") LocalDate dateEnd,
			@Param("takeFeatures") boolean takeFeatures,
			Pageable pageable
	);

	@Query(value = searchCourseUserQuerySelectString + searchCourseWhereString + searchCourseGroupbyString, nativeQuery = true)
	Page<Map> searchCourseUser(
			@Param("title") String title,
			@Param("price1") BigDecimal price1,
			@Param("price2") BigDecimal price2,
			@Param("dateStart") LocalDate dateStart,
			@Param("dateEnd") LocalDate dateEnd,
			@Param("takeFeatures") boolean takeFeatures,
			Pageable pageable
	);

	@Query(value = searchCourseUserQuerySelectString +
			"where c.is_available = true\n" +
			"GROUP BY c.id, c2.id\n" +
			"ORDER BY c.created_at desc limit 10;", nativeQuery = true)
	List<Map> findTop10ByIsAvailableTrueOrderByCreatedAtDesc();

	@Query(value = searchCourseUserQuerySelectString +
			"where c.is_available = true and c2.id = :categoryId\n" +
			"GROUP BY c.id, c2.id\n" +
			"ORDER BY c.created_at desc", nativeQuery = true)
	Page<Map> findAllByCategoryId(Integer categoryId, Pageable pageable);

	@Query(value = searchCourseUserQuerySelectString +
			"where c.is_available = true\n" +
			"GROUP BY c.id, c2.id\n" +
			"ORDER BY c.created_at desc", nativeQuery = true)
	Page<Map> findAllAvailable(Pageable pageable);
}


