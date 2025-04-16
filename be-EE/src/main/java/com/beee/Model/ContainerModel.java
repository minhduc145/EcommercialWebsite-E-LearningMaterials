package com.beee.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "containers")
public class ContainerModel {
	@Id
	@Column(name = "id")
	private Integer id;

	@OneToOne
	@JoinColumn(name = "owner_id")
	private UserModel owner;
}
