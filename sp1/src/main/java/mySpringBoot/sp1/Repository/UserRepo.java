package mySpringBoot.sp1.Repository;

import mySpringBoot.sp1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    @Query(value = "SELECT EXISTS(SELECT 1 FROM users WHERE user_id =:userId)", nativeQuery = true)
    Boolean existsByUserId(@Param("userId") String userId);

    @Query(value = "select * from users where user_id =:userId" , nativeQuery = true)
    User findByUserId(@Param("userId") String userId);
}
