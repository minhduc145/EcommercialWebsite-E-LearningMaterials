package mySpringBoot.sp1.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Data
@Table
public class User {
	@Id
	@Column(name = "user_id")
	private String userId;
	@Column(name = "first_name")
	private String firstName;
	@Column(name = "subname")
	private String subName;
	@Column(name = "last_name")
	private String lastName;
	@Column(name = "age")
	private int age;
	@Column(name = "b_date")
	private LocalDate birthDate;
	@Column(name = "address")
	private String address;
}

