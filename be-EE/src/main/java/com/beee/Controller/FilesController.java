package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Service.FileService;
import com.beee.Service.Impl.S3ServiceImpl;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.S3Service;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;


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
	public ResponseEntity getSignedUrl(@CookieValue(name = "jwt", required = false) String token, @RequestParam String fileKey) {
		String signedUrl = s3Service.generatePresignedUrl(fileKey);
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

	@PostMapping("/unzip-and-upload-stream")
	public ResponseEntity<?> unzipAndUploadStream(@RequestParam String fileKey) {
		try {
			fileService.unzipAndUploadStream(fileKey);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
		}
	}


	@PostMapping("/convert-mp4")
	public ResponseEntity convertVideoFromR2ToHLS(@RequestParam String fileKey) throws IOException, InterruptedException {
		try {
			fileService.convertVideoFromR2ToHLS(fileKey);
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


}
