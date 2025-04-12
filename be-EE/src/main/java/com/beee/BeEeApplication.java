package com.beee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BeEeApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeEeApplication.class, args);
	}

}
