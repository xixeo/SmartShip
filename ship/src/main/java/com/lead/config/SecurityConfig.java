package com.lead.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import com.lead.config.filter.JWTAuthenticationFilter;
import com.lead.config.filter.JWTAuthorizationFilter;
import com.lead.repository.MemberRepo;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Autowired
	private AuthenticationConfiguration authenticationConfiguration;
	@Autowired
	private MemberRepo memberRepo;

	 @Bean
	    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		 
		 
	        
	        JWTAuthenticationFilter jwtAuthenticationFilter = new JWTAuthenticationFilter(authenticationConfiguration.getAuthenticationManager(), memberRepo);
	        jwtAuthenticationFilter.setFilterProcessesUrl("/login"); // 로그인 경로 설정
	        
	        http.csrf(csrf -> csrf.disable());
	        http.authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/users/**").authenticated()
	                .requestMatchers("/api/admin/**").hasRole("ADMIN")
	                .anyRequest().permitAll());
	        http.formLogin(frmLogin -> frmLogin.disable());
	        http.httpBasic(basic -> basic.disable());
	        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
	        http.addFilter(jwtAuthenticationFilter); // JWTAuthenticationFilter 추가
	        http.addFilterBefore(new JWTAuthorizationFilter(memberRepo), AuthorizationFilter.class); // JWTAuthorizationFilter 추가
	        
	        return http.build();
	    }

}