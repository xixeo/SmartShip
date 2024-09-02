package com.lead.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.Nonnull;

@Configuration
public class CustomConfig implements WebMvcConfigurer {


	@Override
	public void addCorsMappings(@Nonnull CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedMethods(CorsConfiguration.ALL)
				.allowedOriginPatterns("http://localhost:3000")
				.allowCredentials(true)								//login시 true로 설정해야한다 > 클라이언트가 쿠키/인증헤더를 포함하도록 허용
				.allowedHeaders(CorsConfiguration.ALL)
				.exposedHeaders(HttpHeaders.AUTHORIZATION);		// 토큰을 header에 넣어 주는 코드

	}
	
}
