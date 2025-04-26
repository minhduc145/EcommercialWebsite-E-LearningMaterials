package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "containers")
public class CourseContainerModel {
	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@OneToMany(mappedBy = "container", orphanRemoval = true, fetch = FetchType.LAZY)
	List<CourseFileModel> files;
}
