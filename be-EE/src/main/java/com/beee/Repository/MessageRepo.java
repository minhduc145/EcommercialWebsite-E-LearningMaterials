package com.beee.Repository;

import com.beee.Model.MessageModel;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface MessageRepo extends JpaRepository<MessageModel, Integer> {
	List<MessageModel> getAllByReceiver_IdOrIsForEveryoneTrue(String receiverId);

	List<MessageModel> findTop10ByReceiver_IdOrIsForEveryoneTrueOrderByCreatedAtDesc(String receiverId);

	Long countAllByReceiver_IdOrIsForEveryoneTrue(String receiverId);

	@Query(
			value = """
					SELECT * FROM messages 
					WHERE
						unaccent(lower(title)) LIKE unaccent(lower(concat('%', :keyword, '%')))
					    OR unaccent(lower(message)) LIKE unaccent(lower(concat('%', :keyword, '%')))
					    OR unaccent(lower(sender_id)) LIKE unaccent(lower(concat('%', :keyword, '%')))
					""", nativeQuery = true
	)
	Page<MessageModel> findByIdOrTitleOrMessageOrSenderId(
			@Param("keyword") String keyword,
			Pageable pageable
	);


}
