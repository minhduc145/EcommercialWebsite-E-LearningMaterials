package com.beee.Repository;

import com.beee.Model.SubscriptionModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepo extends JpaRepository<SubscriptionModel, Long> {
}
