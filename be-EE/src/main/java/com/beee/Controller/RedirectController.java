package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Model.AccountModel;
import com.beee.Repository.AccountRepo;
import com.beee.Service.ResponseService;
import com.beee.WebSecurityService.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {
	@Autowired
	private AccountRepo accountRepo;
	@Autowired
	private ResponseService responseService;
	@Autowired
	private JwtService jwtService;

	@GetMapping("/accounts/oauthLogin/success")
	public String successGoogleLogin(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) {
		responseService.disposeCookie(response, "jwt");
		AccountModel accountModel = accountRepo.findAccountModelByUser_Email(principal.getAttribute("email").toString());
		if (accountModel != null) {
			System.out.println("oauth2:" + principal.getAttribute("email").toString());
			responseService.addCookie(response, "jwt", jwtService.generateToken(accountModel.getId()));
			return "redirect:" + Constants.URL_FE_LOGIN_SUCCESS;
		}
		return "redirect:" + Constants.URL_FE_LOGIN_DEFAULT;
	}

	@GetMapping("/xem-pdf")
	public String xemPdf() {
		return "course-runner"; // Trả về file view-pdf.html
	}

}
