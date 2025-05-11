package com.beee.DTO;

import com.beee.Model.CourseContainerModel;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class CourseContainerRequestDTO {
	private Integer courseId;
	private CourseContainerModel container;
}
