package com.beee.Repository;

import com.beee.Model.NotificationModel;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
@Transactional
public interface NotificationRepo extends JpaRepository<NotificationModel, Integer> {
	List<NotificationModel> getAllByReceiver_IdOrIsForEveryoneTrue(String receiverId);

	List<NotificationModel> findTop10ByReceiver_IdOrIsForEveryoneTrueAndCreatedAtAfter(String receiverId, Timestamp createdAtAfter);

	Long countAllByReceiver_IdOrIsForEveryoneTrue(String receiverId);

	@Query(
			value = """
					SELECT * FROM notifications 
					WHERE
						unaccent(lower(title)) LIKE unaccent(lower(concat('%', :keyword, '%')))
						OR id::TEXT = :keyword
					    OR unaccent(lower(message)) LIKE unaccent(lower(concat('%', :keyword, '%')))
					    OR unaccent(lower(sender_id)) LIKE unaccent(lower(concat('%', :keyword, '%')))
					""", nativeQuery = true
	)
	Page<NotificationModel> findByIdOrTitleOrMessageOrSenderId(
			@Param("keyword") String keyword,
			Pageable pageable
	);


	Long countAllByReceiver_IdOrIsForEveryoneTrueAndCreatedAtAfter(String receiverId, Timestamp createdAtAfter);

	@Query("""
			    SELECT n
			    FROM NotificationModel n
			    WHERE (n.receiver.id = :receiverId OR n.isForEveryone = true)
			      AND (
			        CAST(FUNCTION('unaccent', LOWER(n.title)) AS string) LIKE CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS string)
			        OR CAST(FUNCTION('unaccent', LOWER(n.message)) AS string) LIKE CAST(FUNCTION('unaccent', LOWER(CONCAT('%', :keyword, '%'))) AS string)
			      )
			""")
	Page<NotificationModel> findAllByReceiverIdAndTitleContaingOrMessageContaining(
			@Param("receiverId") String receiverId,
			@Param("keyword") String keyword,
			Pageable pageable
	);

	@Query("""
			    SELECT n
			    FROM NotificationModel n
			    WHERE n.id = :id
			      AND (n.receiver.id = :userId OR n.isForEveryone = true)
			""")
	NotificationModel getByIdAndReceiverIdOrIsForEveryoneTrue(
			@Param("id") Integer id,
			@Param("userId") String userId
	);

//	NotificationModel getByIdAndReceiverIdOrIsForEveryoneTrue(Integer id, String receiverId);

//	Page<NotificationModel> findAllByReceiverIdAndTitleContaingOrMessageContaining(String receiverId, String message, Pageable pageable);
}
