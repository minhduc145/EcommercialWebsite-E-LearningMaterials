package com.beee.Config;

import com.beee.Common.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.net.URI;
import java.time.Duration;

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
				.endpointOverride(URI.create(endpoint))
				.region(Region.US_EAST_1)
				.credentialsProvider(StaticCredentialsProvider.create(awsCreds))
				.serviceConfiguration(
						S3Configuration.builder()
								.pathStyleAccessEnabled(true)
								.build()
				)
				.httpClient(ApacheHttpClient.builder()
						.connectionTimeout(Duration.ofSeconds(60))
						.socketTimeout(Duration.ofSeconds(60))
						.build())
				.build();
	}


	@Bean
	public S3Presigner s3Presigner() {
		AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
		return S3Presigner.builder()
				.endpointOverride(URI.create(endpoint))
				.region(Region.of(region))
				.credentialsProvider(StaticCredentialsProvider.create(awsCreds))
				.build();
	}


}
