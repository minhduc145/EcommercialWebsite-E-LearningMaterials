package com.beee.DTO;

import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
	private String id;
	private String firstName;
	private String lastName;
	private String email;
	private String avatarUrl;
	private String phone;
	private LocalDate birthDate;
	private Boolean isMale;

	private AccountModel account;
	public UserDTO toDto(UserModel user, boolean includePhone) {
		return UserDTO.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.avatarUrl(user.getAvatarUrl())
				.phone(includePhone ? user.getPhone() : null)
				.birthDate(user.getBirthdate())
				.isMale(user.isMale())
				.account(user.getAccount())
				.build();
	}
}
