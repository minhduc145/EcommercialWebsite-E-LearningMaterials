package com.beee.DTO;

import com.beee.Model.CategoryModel;
import jakarta.persistence.ConstructorResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CourseBasicResDTO {
	private Integer id;
	private String title;
	private BigDecimal price;
	private String thumbnailUrl;
	private String categoryName;
	private Long commentCount = 0L;
	private Float averageRating = 0F;
}
