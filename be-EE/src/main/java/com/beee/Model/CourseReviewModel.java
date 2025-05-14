package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

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

	@Column(name = "comment")
	private String comment;

	@Column(name = "star_rate")
	private Integer starRate;

	@Column(name = "created_at",insertable = false, updatable = false)
	private Timestamp createdAt;

	@ManyToOne
	@ToString.Exclude
	@JsonIgnore
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;

	@ManyToOne
	@JoinColumn(name = "reviewer_id", referencedColumnName = "id")
	private UserModel user;
}
