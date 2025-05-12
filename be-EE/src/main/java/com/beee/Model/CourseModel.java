package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.math.BigDecimal;
import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "courses")
public class CourseModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "created_at",insertable = false, updatable = false)
	private Timestamp createdAt;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "is_available")
	private Boolean isAvailable;

	@Column(name = "price")
	private BigDecimal price;

	@Column(name = "status")
	private String status;

	@Column(name = "thumbnail_url")
	private String thumbnailUrl;

	@Column(name = "title")
	private String title;

	@Column(name = "subscriber_number",insertable = false, updatable = false)
	private Long subscriberNumber;

	@Column(name = "is_featured")
	private Boolean isFeatured;

	@Transient
	private String categoryId;

	@ManyToOne
	@JoinColumn(name = "creator_id", referencedColumnName = "id")
	private UserModel creator;

	@ManyToOne
	@JoinColumn(name = "category_id", referencedColumnName = "id")
	private CategoryModel category;
}
