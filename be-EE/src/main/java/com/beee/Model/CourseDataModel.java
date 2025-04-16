package com.beee.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "course_data")
public class CourseDataModel {
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "folder_id")
	private CourseFolderModel folder;

	@ManyToOne
	@JoinColumn(name = "course_id")
	private CourseModel course;
}
