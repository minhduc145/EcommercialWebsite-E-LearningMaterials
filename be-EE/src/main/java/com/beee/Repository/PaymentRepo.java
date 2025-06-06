package com.beee.Repository;

import com.beee.Model.VnpayTransactionLogModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface PaymentRepo extends JpaRepository<VnpayTransactionLogModel,String > {
}
