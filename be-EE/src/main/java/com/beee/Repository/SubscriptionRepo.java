package com.beee.Repository;

import com.beee.Common.Constants;
import com.beee.Model.SubscriptionModel;
import com.beee.Model.UserFavouriteModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Repository
public interface SubscriptionRepo extends JpaRepository<SubscriptionModel, Long> {
	boolean existsByUser_IdAndCourse_Id(String userId, Integer courseId);

	SubscriptionModel findByUser_IdAndCourse_Id(String userId, Integer courseId);

	String searchFeaturesUserQuery = """
			select s.*
			from subscriptions s inner join courses c on s.course_id = c.id
			inner join categories c2 on c.category_id = c2.id
			where s.user_id =:userId
			and ((unaccent(lower(c.title)) like unaccent(lower(CONCAT('%', :keyword, '%')))) or (unaccent(lower(c2.name)) like unaccent(lower(CONCAT('%', :keyword, '%')))))\n
			""";

	@Query(value = searchFeaturesUserQuery, nativeQuery = true)
	Page<SubscriptionModel> findAllByUser_Id(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByTitleAsc, nativeQuery = true)
	Page<SubscriptionModel> findAllByUser_IdTitleASC(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByTitleDesc, nativeQuery = true)
	Page<SubscriptionModel> findAllByUser_IdTitleDESC(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByPriceAsc, nativeQuery = true)
	Page<SubscriptionModel> findAllByUser_IdPriceAsc(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByPriceDesc, nativeQuery = true)
	Page<SubscriptionModel> findAllByUser_IdPriceDesc(String userId, String keyword, Pageable pageable);

	SubscriptionModel findSubscriptionModelById(Integer id);
}
