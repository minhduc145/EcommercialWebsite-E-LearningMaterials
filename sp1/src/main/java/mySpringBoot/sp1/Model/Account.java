package mySpringBoot.sp1.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "accounts")
public class Account {
	@Id
	@Column(name = "user_id")
	private String userId;

	@Column(name = "email")
	private String email;
	@Column(name = "password")
	private String password;

	@OneToOne
	@JoinColumn(name = "userId", referencedColumnName = "userId")
	private User user;

}
