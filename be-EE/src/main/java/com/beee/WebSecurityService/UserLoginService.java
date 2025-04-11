package com.beee.WebSecurityService;

import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService implements UserDetailsService {
	@Autowired
	private AccountRepo accountRepo;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AccountModel accountModel = accountRepo.findByIdOrUser_Email(username, username);
		if (accountModel == null) throw new UsernameNotFoundException("User not found");
		UserDetails user = User.builder()
				.username(accountModel.getId())
				.password(accountModel.getPassword())
				.roles(accountModel.getRole())
				.build();
		return user;
	}

}

