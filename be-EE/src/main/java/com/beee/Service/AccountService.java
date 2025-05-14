package com.beee.Service;

import com.beee.Common.Constants;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AccountService {
	public boolean isJwtOk(String jwtToken);

	public boolean isAdminJwtOk(String jwtToken);
}
