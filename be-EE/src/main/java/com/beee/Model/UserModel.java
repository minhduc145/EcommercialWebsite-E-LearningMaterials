package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

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

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "avatar_url")
	private String avatarUrl;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "phone")
	private String phone;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private AccountModel account;
}
