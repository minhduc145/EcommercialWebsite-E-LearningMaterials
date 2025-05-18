package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Repository.AccountRepo;
import com.beee.Service.AccountService;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
	private final JwtService jwtService;
	private final AccountRepo accountRepo;

	public AccountServiceImpl(JwtService jwtService, AccountRepo accountRepo) {
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
	}

	public boolean isJwtOk(String jwtToken) {
		try {
			return jwtToken != null && !jwtService.isTokenExpired(jwtToken);
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isAdminJwtOk(String jwtToken) {
		if (!isJwtOk(jwtToken))
			return false;
		try {
			String username = jwtService.extractUsername(jwtToken);
			return username != null && accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN);
		} catch (Exception e) {
			return false;
		}
	}
}
