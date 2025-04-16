package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

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

	@Column(name = "created_at")
	private Timestamp createdAt;

	@Column(name = "creator_id", updatable = false, insertable = false)
	private String creatorId;

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

	@ManyToOne
	@JoinColumn(name = "creator_id", referencedColumnName = "id")
	private UserModel creator;

	@ManyToOne
	@JoinColumn(name = "category_id", referencedColumnName = "id")
	private CategoryModel category;

}
