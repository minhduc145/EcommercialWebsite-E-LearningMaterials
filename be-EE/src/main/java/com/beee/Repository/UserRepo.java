package com.beee.Repository;

import com.beee.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UserModel, String> {
	UserModel findUserModelById(String id);

	UserModel findUserModelByEmailEqualsIgnoreCase(String email);
}
