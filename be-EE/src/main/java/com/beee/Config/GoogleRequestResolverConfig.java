package com.beee.Config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.Map;

public class GoogleRequestResolverConfig implements OAuth2AuthorizationRequestResolver {
	private final OAuth2AuthorizationRequestResolver defaultResolver;

	public GoogleRequestResolverConfig(ClientRegistrationRepository repo, String uri) {
		this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, uri);
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
		return customize(defaultResolver.resolve(request));
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String id) {
		return customize(defaultResolver.resolve(request, id));
	}

	private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest req) {
		if (req == null) return null;
		return OAuth2AuthorizationRequest.from(req)
				.additionalParameters(Map.of("prompt", "select_account"))
				.build();
	}
}
