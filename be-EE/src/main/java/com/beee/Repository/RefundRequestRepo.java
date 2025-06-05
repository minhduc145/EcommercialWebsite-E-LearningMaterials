package com.beee.Repository;

import com.beee.Model.RefundRequestModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface RefundRequestRepo extends JpaRepository<RefundRequestModel,Integer> {
	List<RefundRequestModel> findAllBySubscription_User_Id(String subscriptionUserId);

	List<RefundRequestModel> findAllBySubscription_User_IdAndStatus(String subscriptionUserId, String status);

	List<RefundRequestModel> findAllBySubscription_User_IdOrderByCreatedAtDesc(String subscriptionUserId);

	List<RefundRequestModel> findAllBySubscription_User_IdOrderByCreatedAtAsc(String subscriptionUserId);
}
