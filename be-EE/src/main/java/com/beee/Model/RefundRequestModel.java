package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "refund_requests")
public class RefundRequestModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "status")
	private String status;

	@Column(name = "user_reason")
	private String userReason;

	@Column(name = "created_at", updatable = false, insertable = false)
	private LocalDateTime createdAt;

	@Column(name = "update_at")
	private LocalDateTime updateAt;

	@Column(name = "admin_reason")
	private String adminReason;
	@OneToOne
	@JoinColumn(name = "subscription_id")
	private SubscriptionModel subscription;
}
