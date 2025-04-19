package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

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
	@JoinColumn(name = "container_id", referencedColumnName = "id")
	private CourseContainerModel container;

	@JsonIgnore
	@ToString.Exclude
	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	private CourseModel course;
}
