package com.beee.Repository;

import com.beee.Model.AccountModel;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AccountRepo extends JpaRepository<AccountModel, String> {
	AccountModel findAccountModelById(String id);

	Boolean existsAccountModelByUser_Email(String userEmail);

	AccountModel findAccountModelByUser_Email(String userEmail);

	AccountModel findByIdOrUser_Email(String id, String userEmail);

	boolean existsByIdAndRole(String id, String role);
}
