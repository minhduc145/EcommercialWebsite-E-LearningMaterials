package mySpringBoot.sp1.Controller;

import mySpringBoot.sp1.Model.Account;
import mySpringBoot.sp1.Repository.AccountRepo;
import mySpringBoot.sp1.Repository.UserRepo;
//import mySpringBoot.sp1.Services.JwtUtils;
import mySpringBoot.sp1.Service.Custom.AuthServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

//
//    private final JwtUtils jwtUtils;
//
//    public AuthController(JwtUtils jwtUtils) {
//        this.jwtUtils = jwtUtils;
//    }

	@Autowired
	private UserRepo userRepo;
	@Autowired
	private AccountRepo accountRepo;
//    @Autowired
//    private JwtUtils jwtUtils;

	@PostMapping(value = "/Auth/Login", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, String>> login(@ModelAttribute Account account) {
		Map<String, String> response = new HashMap<>();
		String sha256hex = AuthServices.HashPassword(account.getPassword());
		boolean existed_acc = accountRepo.existsAccountByUserId(account.getUserId());
		if (existed_acc) {
			Account acc = accountRepo.findAccountByUserIdAndPassword(account.getUserId(), sha256hex);
			if (acc == null) {
				return ResponseEntity.notFound().header("message", "Wrong password " + sha256hex).build();
			}
//            String token = jwtUtils.generateToken(account.getUser_id());
			response.put("user_id", account.getUserId());
			response.put("password", sha256hex);
//            response.put("token", token);
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.notFound().header("message", "ACC. not found").build();
		}
	}
}
