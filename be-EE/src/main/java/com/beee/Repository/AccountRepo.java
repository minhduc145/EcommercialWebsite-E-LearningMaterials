package com.beee.Repository;

import com.beee.Model.AccountModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepo extends JpaRepository<AccountModel, String> {
	AccountModel findAccountModelById(String id);
}
