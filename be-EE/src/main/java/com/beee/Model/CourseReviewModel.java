package com.beee.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "course_reviews")
public class CourseReviewModel {
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "comment", columnDefinition = "TEXT")
	private String comment;

	@Column(name = "star_rate")
	private Integer star_rate;

	@Column(name = "created_at")
	private Timestamp created_at;

	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;

	@ManyToOne
	@JoinColumn(name = "reviewer_id", referencedColumnName = "id")
	private UserModel user;
}
