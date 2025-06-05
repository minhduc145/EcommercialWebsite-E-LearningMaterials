package com.beee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "accounts")
public class AccountModel {
	@Id
	@Column(name = "id")
	private String id;

	@JsonIgnore
	@Column(name = "password")
	private String password;

	@Column(name = "role")
	private String role;

	@Column(name = "provider")
	private String provider;

	@Column(name="is_locked")
	private Boolean isLocked = false;
	@Column(name = "created_at", updatable = false, insertable = false)
	private Timestamp createdAt;

	@OneToOne
	@JoinColumn(name = "id")
	@MapsId
	@ToString.Exclude
	@JsonIgnore
	private UserModel user;
}
