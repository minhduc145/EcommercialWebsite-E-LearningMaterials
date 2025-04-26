package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Service.Impl.S3ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/files")
public class FilesController {
	@Autowired
	private S3ServiceImpl s3Service;

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			String bucketName = Constants.CLOUD_BUCKET_NAME;
			String fileKey = file.getOriginalFilename();
			s3Service.uploadFile(bucketName, fileKey, file);
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


}
