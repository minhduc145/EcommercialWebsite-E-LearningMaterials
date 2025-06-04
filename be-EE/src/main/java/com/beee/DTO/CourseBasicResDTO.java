package com.beee.DTO;

import com.beee.Model.CategoryModel;
import jakarta.persistence.ConstructorResult;
import lombok.*;


import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseBasicResDTO {
	private Integer id;
	private String title;
	private BigDecimal price;
	private String thumbnailUrl;
	private String categoryName;
	private Long commentCount = 0L;
	private BigDecimal averageRating;
	private Boolean isFeatured = false;
}
