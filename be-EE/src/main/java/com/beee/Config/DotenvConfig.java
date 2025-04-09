package com.beee.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.*;

import java.util.HashMap;
import java.util.Map;

public class DotenvConfig implements EnvironmentPostProcessor {

	@Override
	public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();
		Map<String, Object> map = new HashMap<>();
		map.put("vnpay.tmn-code", dotenv.get("VNPAY_TMN_CODE"));
		map.put("vnpay.hash-secret", dotenv.get("VNPAY_HASH_SECRET"));
		map.put("vnpay.pay-url", dotenv.get("VNPAY_PAY_URL"));
		map.put("vnpay.return-url", dotenv.get("VNPAY_RETURN_URL"));
		System.out.println(map);
		PropertySource<?> propertySource = new MapPropertySource("dotenv", map);
		environment.getPropertySources().addFirst(propertySource);
	}
}
