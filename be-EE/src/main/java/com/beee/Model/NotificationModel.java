package com.beee.Model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "notifications")
public class NotificationModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "title")
	private String title;

	@Column(name = "message", columnDefinition = "TEXT")
	private String message;

	@Column(name = "is_for_everyone")
	private Boolean isForEveryone;

	@Column(name = "created_at", insertable = false, updatable = false)
	private Timestamp createdAt;

	@ManyToOne
	@JoinColumn(name = "sender_id", referencedColumnName = "id")
	private UserModel sender;

	@ManyToOne
	@JoinColumn(name = "receiver_id", referencedColumnName = "id")
	private UserModel receiver;
}
