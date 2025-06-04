package com.beee.Repository;

import com.beee.Model.RefundRequestModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface RefundRequestRepo extends JpaRepository<RefundRequestModel,Integer> {
}
