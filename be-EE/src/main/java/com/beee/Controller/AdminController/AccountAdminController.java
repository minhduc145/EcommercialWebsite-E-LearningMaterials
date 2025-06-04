package com.beee.Controller.AdminController;

import com.beee.Repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/accounts")
public class AccountAdminController {
	private final UserRepo userRepo;

	public AccountAdminController(UserRepo userRepo) {
		this.userRepo = userRepo;
	}

	@GetMapping("/users")
	public ResponseEntity listUsers() {
		return ResponseEntity.ok().body(userRepo.findAll());
	}
}
