package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "user_favourites")
public class UserFavouriteModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "created_at",insertable = false, updatable = false)
	private Timestamp createdAt;

	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private UserModel user;

	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;
}
