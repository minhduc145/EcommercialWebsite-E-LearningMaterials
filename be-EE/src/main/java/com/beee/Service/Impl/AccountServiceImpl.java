package com.beee.Service.Impl;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AccountServiceImpl implements AccountService {
	@Override
	public Map onDefaultLogin() {
		return Map.of();
	}
}
