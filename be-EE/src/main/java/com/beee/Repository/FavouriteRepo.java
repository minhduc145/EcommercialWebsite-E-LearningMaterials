package com.beee.Repository;

import com.beee.Common.Constants;
import com.beee.Model.UserFavouriteModel;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public interface FavouriteRepo extends JpaRepository<UserFavouriteModel, Integer> {
	boolean existsByUser_IdAndCourse_Id(String userId, Integer courseId);

	Object removeByCourse_IdAndUser_Id(Integer courseId, String userId);


	String searchFeaturesUserQuery = """
			select uf.*
				from user_favourites uf inner join courses c on uf.course_id = c.id
				inner join categories c2 on c.category_id = c2.id
				where uf.user_id = :userId
				and ((unaccent(lower(c.title)) like unaccent(lower(CONCAT('%', :keyword, '%')))) or (unaccent(lower(c2.name)) like unaccent(lower(CONCAT('%', :keyword, '%')))))\n
			""";

	@Query(value = searchFeaturesUserQuery, nativeQuery = true)
	Page<UserFavouriteModel> findAllByUser_Id(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByTitleAsc, nativeQuery = true)
	Page<UserFavouriteModel> findAllByUser_IdTitleASC(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByTitleDesc, nativeQuery = true)
	Page<UserFavouriteModel> findAllByUser_IdTitleDESC(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByPriceAsc, nativeQuery = true)
	Page<UserFavouriteModel> findAllByUser_IdPriceAsc(String userId, String keyword, Pageable pageable);

	@Query(value = searchFeaturesUserQuery + Constants.addOrderByPriceDesc, nativeQuery = true)
	Page<UserFavouriteModel> findAllByUser_IdPriceDesc(String userId, String keyword, Pageable pageable);

}
