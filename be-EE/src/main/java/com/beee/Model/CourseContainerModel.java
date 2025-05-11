package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Builder
@Table(name = "containers")
public class CourseContainerModel {
	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	private UUID id;

	@NotBlank
	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@OneToMany(mappedBy = "container", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("createdAt ASC")
	List<CourseFileModel> files;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "id")
	CourseModel course;
}
