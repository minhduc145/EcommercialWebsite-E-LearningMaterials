package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

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

	@NotBlank
	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@Column(name = "type")
	private String type;

	@Column(name = "extension")
	private String extension;

	@Column(name = "status")
	private String status;

	@NotBlank
	@Column(name = "url", columnDefinition = "TEXT")
	private String url;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@ToString.Exclude
	@ManyToOne
	@JoinColumn(name = "container_id", referencedColumnName = "id")
	private CourseContainerModel container;

	@JsonIgnore
	@ToString.Exclude
	@ManyToOne
	@JoinColumn(name = "author_id", referencedColumnName = "id")
	private UserModel user;
}
