package com.beee.Repository;

import com.beee.Model.UserFavouriteModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public interface FavouriteRepo extends JpaRepository<UserFavouriteModel, Integer> {
	boolean existsByUser_IdAndCourse_Id(String userId, Integer courseId);

	Object removeByCourse_IdAndUser_Id(Integer courseId, String userId);
}
