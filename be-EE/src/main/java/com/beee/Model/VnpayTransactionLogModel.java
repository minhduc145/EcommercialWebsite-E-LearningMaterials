package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "vnpay_transaction_logs")
public class VnpayTransactionLogModel {
	@Id
	@Column(name = "payment_id")
	private String paymentId;

	@Column(name = "bank_code")
	private String bankCode;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "user_id")
	private String userId;

	@Column(name = "course_id")
	private Integer courseId;

	@Column(name = "amount")
	private BigDecimal amount;

	@Column(name = "description")
	private String description;

	@Column(name = "is_successful")
	private Boolean isSuccessful;

	@Column(name = "is_return_type")
	private Boolean isReturnType;

	@Column(name = "promote_amount")
	private BigDecimal promoteAmount;

	@Column(name = "response_code")
	private Short responseCode;
}