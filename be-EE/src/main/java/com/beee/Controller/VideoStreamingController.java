//package com.beee.Controller;
//
//import com.beee.WebSecurityService.JwtService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.IOException;
//
//@RestController
//@RequestMapping("/api/video")
//public class VideoStreamingController {
//
//	private final VideoService videoService;
//	private final JwtService jwtService;
//
//	public VideoController(VideoService videoService, JwtService jwtService) {
//		this.videoService = videoService;
//		this.jwtService = jwtService;
//	}
//
//	@GetMapping("/stream")
//	public void streamVideo(
//			@RequestParam String file,
//			HttpServletRequest request,
//			HttpServletResponse response
//	) throws IOException {
//		String token = jwtService.extractUsername(request);
//		if (!jwtService.isValid(token) || !jwtService.hasAccess(token, file)) {
//			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Unauthorized");
//			return;
//		}
//
//		videoService.streamFromR2(file, request, response);
//	}
//}
//
