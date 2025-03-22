package mySpringBoot.sp1.Repository;

import mySpringBoot.sp1.Model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepo extends JpaRepository<Account, Long> {
	boolean existsAccountByUserId(String userId);

	Account findAccountByUserIdAndPassword(String userId, String password);
}
