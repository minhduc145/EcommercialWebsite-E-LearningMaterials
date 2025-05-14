package com.beee.Controller;

import com.beee.Model.CourseModel;
import com.beee.Model.UserFavouriteModel;
import com.beee.Model.UserModel;
import com.beee.Repository.FavouriteRepo;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.WebSecurityService.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {

	private final JwtService jwtService;
	private final FavouriteRepo favouriteRepo;
	private final CourseService courseService;
	private final AccountService accountService;

	public FavouriteController(JwtService jwtService, FavouriteRepo favouriteRepo, CourseService courseService, AccountService accountService) {
		this.jwtService = jwtService;
		this.favouriteRepo = favouriteRepo;
		this.courseService = courseService;
		this.accountService = accountService;
	}

	@PutMapping("/add")
	public ResponseEntity addToFavourite(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> map) {
		if (!accountService.isJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		return ResponseEntity.ok().body(favouriteRepo.save(UserFavouriteModel
				.builder()
				.user(UserModel.builder().id(username).build())
				.course(CourseModel.builder().id(Integer.parseInt(map.getOrDefault("courseId", "0"))).build()).build()));
	}

	@DeleteMapping("/delete")
	public ResponseEntity deleteFromFavourite(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> map) {
		if (userToken == null || jwtService.isTokenExpired(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		return ResponseEntity.ok(favouriteRepo.removeByCourse_IdAndUser_Id(Integer.parseInt(map.getOrDefault("courseId", "0")), username));
	}
}
