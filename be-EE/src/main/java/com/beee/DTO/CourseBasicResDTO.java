package com.beee.DTO;

import com.beee.Model.CategoryModel;
import com.beee.Model.UserModel;


import java.math.BigDecimal;
import java.sql.Timestamp;

public class FeaturedCourseResDTO {
	private Integer id;
	private Timestamp createdAt;
	private String description;
	private Boolean isAvailable;
	private BigDecimal price;
	private String status;
	private String thumbnailUrl;
	private String title;
	private Long subscriberNumber;
	private boolean isFeatured;
	private CategoryModel category;
}
