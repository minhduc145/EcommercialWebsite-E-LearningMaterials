package com.beee.Service;

import com.beee.Common.Constants;
import com.beee.DTO.UserLoginFormDTO;
import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.UserModel;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public interface AccountService {
	public boolean isJwtOk(String jwtToken);

	public boolean isAdminJwtOk(String jwtToken);

	public ResponseEntity login(UserLoginFormDTO loginFormDTO, HttpServletResponse response);

	public ResponseEntity signup(UserRegisterFormDTO formBody);

	public ResponseEntity editProfile(MultiValueMap<String, String> formData, String userToken, UserModel userModel, MultipartFile avatarFile);

	public ResponseEntity editPassword(String userToken, Map<String, String> formData);

	public ResponseEntity getUserInfo(String token, HttpServletResponse response);
}
