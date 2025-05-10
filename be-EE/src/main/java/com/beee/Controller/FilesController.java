package com.beee.Controller;

import com.beee.Service.FileService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.S3Service;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/api/files")
public class FilesController {
	@Autowired
	private S3Service s3Service;
	@Autowired
	private RabbitMQProducer rabbitMQProducer;
	@Autowired
	private S3Client s3Client;
	@Autowired
	private FileService fileService;

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			String newFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			s3Service.uploadFileViaSignedUrl(file, newFileName);
			return ResponseEntity.ok("File uploaded successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteFile(@CookieValue(name = "jwt", required = false) String token, String fileKey) {
		try {
			System.out.println(fileKey);
			s3Service.deleteObject(fileKey);
			return ResponseEntity.ok("File deleted successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("File deleted failed: " + e.getMessage());
		}
	}

	@GetMapping("/getSigned")
	public ResponseEntity getSignedUrl(@CookieValue(name = "jwt", required = false) String token, @RequestParam(required = false) String fileKey) {
		String signedUrl = s3Service.generatePresignedUrl(fileKey);
		return ResponseEntity.ok(signedUrl);
	}

	@GetMapping("/uploadSigned")
	public ResponseEntity getSignedUrlForUpload(@CookieValue(name = "jwt", required = false) String token, @RequestParam(required = false) String fileKey) {
		String signedUrl = s3Service.generatePresignedUploadUrl(fileKey, 30);
		return ResponseEntity.ok(signedUrl);
	}

	@PostMapping("/process")
	public ResponseEntity processFile() {
		Map map = new HashMap();
		map.put("file", 1);
		rabbitMQProducer.sendToFileProcessQueue(map);
		rabbitMQProducer.sendToQ1("jhiafhsdf", "kdfgshjdf");
		return ResponseEntity.ok().build();
	}

//	@PostMapping("/unzip-and-upload-stream")
//	public ResponseEntity<?> unzipAndUploadStream(@RequestParam String fileKey) {
//		try {
//			fileService.unzipAndUploadStream(fileKey,null);
//			return ResponseEntity.ok().build();
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
//		}
//	}


	@PostMapping("/convert-mp4")
	public ResponseEntity convertVideoFromR2ToHLS(@RequestParam String fileKey) throws IOException, InterruptedException {
		try {
			fileService.convertVideoFromR2ToHLS(fileKey, null);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}


	@DeleteMapping("/deletePrefix")
	public ResponseEntity deletePrefix(@RequestParam String prefix) throws IOException, InterruptedException {
		s3Service.deleteFolderInParallel(prefix);
		return ResponseEntity.ok().build();
	}

	private final String R2_BASE_URL = "https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/hls/";

	@GetMapping("/proxy-scorm")
	public ResponseEntity<?> proxyScorm(
			@RequestParam String path,
			@RequestParam(defaultValue = "") String base
	) throws IOException {

		String baseUrl = "https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/Getting%20started%20with%20iSpring/res/";
		String fullUrl = baseUrl + (base.isEmpty() ? "" : base + "/") + path;

		URL url = new URL(fullUrl);
		URLConnection connection = url.openConnection();

		// Lấy content type chính xác
		String contentType = connection.getContentType();
		if (contentType == null || contentType.isBlank()) {
			contentType = Files.probeContentType(Path.of(path));
		}

		InputStream inputStream = connection.getInputStream();
		return ResponseEntity
				.ok()
				.contentType(MediaType.parseMediaType(contentType))
				.body(new InputStreamResource(inputStream));
	}
	@GetMapping("/scorm-view")
	public ResponseEntity<String> loadScormPage() throws IOException {
		String baseUrl = "https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/Getting%20started%20with%20iSpring/res/";
		URL url = new URL(baseUrl + "index.html");
		String html = new String(url.openStream().readAllBytes(), StandardCharsets.UTF_8);

		// Rewrite đường dẫn
		html = html.replaceAll("(?m)(src|href)=\"(data/[^\"\\?]+)\"", "$1=\"/api/files/proxy-scorm?path=$2&base=data\"");

		return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
	}




	@GetMapping("/proxy-file")
	public void proxyFile(@RequestParam String path, HttpServletResponse response) throws IOException {
		URL url = new URL(R2_BASE_URL + path);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		conn.connect();

		if (conn.getResponseCode() != 200) {
			response.sendError(conn.getResponseCode(), "Không thể truy cập file");
			return;
		}

		if (path.endsWith(".m3u8")) {
			response.setContentType("application/vnd.apple.mpegurl");
			String m3u8Content = new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

			// Thay đổi đường dẫn segment để gọi lại proxy
			m3u8Content = m3u8Content.replaceAll("(?m)^([^#\\n][^\\n]*)$", "/api/files/proxy-file?path=$1");

			response.getWriter().write(m3u8Content);
		} else if (path.endsWith(".ts")) {
			response.setContentType("video/mp2t");
			IOUtils.copy(conn.getInputStream(), response.getOutputStream());
		} else {
			response.setContentType(conn.getContentType());
			IOUtils.copy(conn.getInputStream(), response.getOutputStream());
		}
	}

}


