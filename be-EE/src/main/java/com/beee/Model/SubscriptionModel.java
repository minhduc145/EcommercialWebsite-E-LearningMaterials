package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "subscriptions")
public class SubscriptionModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "bought_price")
	private BigDecimal boughtPrice;

	@Column(name = "status")
	private String status;

	@Column(name = "is_available")
	private Boolean isAvailable;

	@Column(name = "created_at",insertable = false, updatable = false)
	private Timestamp createdAt;

	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private UserModel user;

	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;
}
