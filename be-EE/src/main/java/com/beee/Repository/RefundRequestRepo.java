package com.beee.Repository;

import com.beee.Model.RefundRequestModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface RefundRequestRepo extends JpaRepository<RefundRequestModel,Integer> {
	@Query("""
    SELECT r
    FROM RefundRequestModel r
    WHERE r.subscription.user.id = :userId
    AND CAST(FUNCTION('unaccent', LOWER(r.subscription.course.title)) AS string) LIKE CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS STRING)
""")
	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContaining(
			@Param("userId") String userId,
			@Param("keyword") String keyword
	);

	@Query("""
    SELECT r
    FROM RefundRequestModel r
    WHERE r.subscription.user.id = :subscriptionUserId
      AND CAST(FUNCTION('unaccent', LOWER(r.subscription.course.title)) AS string) LIKE
          CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS string)
      AND r.status = :status
""")
	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingAndStatus(
			@Param("subscriptionUserId") String subscriptionUserId,
			@Param("keyword") String keyword,
			@Param("status") String status
	);

	@Query("""
    SELECT r
    FROM RefundRequestModel r
    WHERE r.subscription.user.id = :subscriptionUserId
      AND CAST(FUNCTION('unaccent', LOWER(r.subscription.course.title)) AS string) LIKE
          CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS string)
    ORDER BY r.createdAt DESC
""")
	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtDesc(
			@Param("subscriptionUserId") String subscriptionUserId,
			@Param("keyword") String keyword
	);

	@Query("""
			    SELECT r
			    FROM RefundRequestModel r
			    WHERE r.subscription.user.id = :subscriptionUserId
			      AND CAST(FUNCTION('unaccent', LOWER(r.subscription.course.title)) AS string) LIKE
			          CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS string)
			    ORDER BY r.createdAt ASC
			""")
	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtAsc(
			@Param("subscriptionUserId") String subscriptionUserId,
			@Param("keyword") String keyword
	);
//
////	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContaining(String subscriptionUserId, String keyword);
//
//	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingAndStatus(String subscriptionUserId, String keyword, String status);
//
//	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtDesc(String subscriptionUserId, String keyword);
//
//	List<RefundRequestModel> findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtAsc(String subscriptionUserId, String keyword);
}
