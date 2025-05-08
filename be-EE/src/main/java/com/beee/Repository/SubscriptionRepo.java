package com.beee.Repository;

import com.beee.Model.SubscriptionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface SubscriptionRepo extends JpaRepository<SubscriptionModel, Long> {
}
