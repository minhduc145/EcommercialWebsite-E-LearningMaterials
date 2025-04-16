package com.beee.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "files")
public class CourseFileModel {
	@Id
	@Column(name="id")
	private UUID id;

	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp created_at;

	@Column(name = "type", length = 5)
	private String type;
}
