package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
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

	@Column(name = "name")
	private String name;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@Column(name = "type")
	private String type;

	@Column(name = "extension")
	private String extension;

	@Column(name = "url", columnDefinition = "TEXT")
	private String url;

	@JsonIgnore
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
