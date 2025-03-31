package com.beee.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRegisterFormDTO {
	@NotBlank(message = "Username không được để trống")
	private String username;

	@NotBlank(message = "Họ tên không được để trống")
	@Pattern(regexp = "^[a-zA-ZÀ-ỹ ]+$", message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng")
	private String firstName;

	@NotBlank(message = "Họ tên không được để trống")
	@Pattern(regexp = "^[a-zA-ZÀ-ỹ ]+$", message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng")
	private String lastName;

	@Email(message = "Email phải nhập đúng định dạng")
	private String email;
}
