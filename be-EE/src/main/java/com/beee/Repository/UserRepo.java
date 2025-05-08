package com.beee.Repository;

import com.beee.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface UserRepo extends JpaRepository<UserModel, String> {
	UserModel findUserModelById(String id);
}
