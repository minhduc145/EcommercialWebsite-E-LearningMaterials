package com.beee.DTO;

import com.beee.Model.CourseFileModel;
import lombok.Data;
import lombok.ToString;

import java.util.UUID;

@Data
@ToString
public class CourseFileReqDTO {
	private UUID containerId;
	private CourseFileModel file;
}
