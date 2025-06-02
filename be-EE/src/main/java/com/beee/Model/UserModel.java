package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Builder
@Entity
@Table(name = "users")
public class UserModel {
	@Id
	@Column(name = "id")
	private String id;

	@NotBlank(message = "Họ tên không được để trống")
	@Column(name = "first_name")
	private String firstName;

	@NotBlank(message = "Họ tên không được để trống")
	@Column(name = "last_name")
	private String lastName;

	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email phải nhập đúng định dạng")
	@Column(name = "email")
	private String email;

	@Column(name = "avatar_url")
	private String avatarUrl;

	@Column(name = "birthdate")
	private LocalDate birthdate;

	@Column(name = "is_male")
	private boolean isMale;


	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải 10 chữ số")
	@Column(name = "phone")
	private String phone;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private AccountModel account;
}
