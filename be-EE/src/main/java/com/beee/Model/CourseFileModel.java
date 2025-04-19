package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.UUID;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "files")
public class CourseFileModel {
	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@Column(name = "type", length = 10)
	private String type;

	@Column(name = "extension")
	private String extension;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "url", columnDefinition = "TEXT")
	private String url;

	@JsonIgnore
	@ToString.Exclude
	@ManyToOne
	@JoinColumn(name = "container_id", referencedColumnName = "id")
	private CourseContainerModel container;
}
