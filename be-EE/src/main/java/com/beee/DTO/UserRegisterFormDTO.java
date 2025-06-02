package com.beee.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@ToString
public class UserRegisterFormDTO {
	@NotBlank(message = "Vui lòng nhập Username")
	@Size(min = 3, message = "Username phải có ít nhất 3 ký tự")
	@Pattern(
			regexp = "^(?=.*[A-Za-z])(?=.*\\d).{3,}$",
			message = "Username phải chứa ít nhất một chữ cái và một số"
	)
	private String username;

	@NotBlank(message = "Họ tên không được để trống")
	@Pattern(regexp = "^[a-zA-ZÀ-ỹ ]+$", message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng")
	private String firstName;

	@NotBlank(message = "Họ tên không được để trống")
	@Pattern(regexp = "^[a-zA-ZÀ-ỹ ]+$", message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng")
	private String lastName;

	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email phải nhập đúng định dạng")
	private String email;

	@NotBlank(message = "Số điện thoại không được để trống")
	@Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải gồm đúng 10 chữ số")
	private String phone;

	@NotBlank(message = "Mật khẩu không được để trống")
	@Size(min = 3, message = "Mật khẩu ít nhất 3 ký tự")
	private String password;

	@NotBlank(message = "Xác nhận mật khẩu không được để trống")
	@Size(min = 3, message = "Xác nhận mật khẩu ít nhất 3 ký tự")
	private String confirmPassword;

	private LocalDate birthdate;
	private String isMale;
}
