package com.beee.DTO;

import com.beee.Model.CourseContainerModel;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class CourseDataRequestDTO {
	private Integer courseId;
	private List<CourseContainerModel> object;
}
