package com.beee.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class S3Config {
	@Value("${cloud.aws.credentials.access-key}")
	private String accessKey;

	@Value("${cloud.aws.credentials.secret-key}")
	private String secretKey;

	@Value("${cloud.aws.endpoint}")
	private String endpoint;

	@Value("${cloud.aws.region}")
	private String region;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
		return S3Client.builder()
				.endpointOverride(URI.create(endpoint)) // Cấu hình endpoint Cloudflare R2
				.region(Region.of(region)) // Cấu hình vùng APAC (Asia-Pacific)
				.credentialsProvider(StaticCredentialsProvider.create(awsCreds)) // Cung cấp thông tin xác thực
				.build();
	}
}
