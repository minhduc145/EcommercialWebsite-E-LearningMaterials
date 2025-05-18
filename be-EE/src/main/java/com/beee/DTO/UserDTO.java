package com.beee.DTO;

import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
	private AccountModel account;
	public UserDTO toDto(UserModel user, boolean includePhone) {
		return UserDTO.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.avatarUrl(user.getAvatarUrl())
				.phone(includePhone ? user.getPhone() : null)
				.account(user.getAccount())
				.build();
	}
}
