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

	@Column(name = "created_at")
	private Timestamp created_at;

	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private UserModel user;

	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;
}
