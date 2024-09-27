package com.lead.config.filter;

import java.io.IOException;
import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lead.entity.Member;
import com.lead.repository.MemberRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final MemberRepo memberRepo; // 생성자 주입으로 변경
    
    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, MemberRepo memberRepo) {
        this.authenticationManager = authenticationManager;
        this.memberRepo = memberRepo;
    }
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // JSON 데이터를 Member 객체로 변환
            Member member = mapper.readValue(req.getInputStream(), Member.class);
            
            // id와 pw를 사용한 인증 토큰 생성
            Authentication authToken = new UsernamePasswordAuthenticationToken(member.getId(), member.getPw());
            
            log.info(member.getId() + "이 로그인 시도 했다.");
            return authenticationManager.authenticate(authToken);
        } catch (Exception e) {
            log.error("로그인 오류: " + e.getMessage());
            res.setStatus(HttpStatus.UNAUTHORIZED.value());
        }
        return null;
    }

    
    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        log.info("successfulAuthentication");
        User user = (User) authResult.getPrincipal();
        String id = user.getUsername();
        
        // MemberRepo를 통해 username으로 Member 객체를 조회
        Member member = memberRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")); // 예외 처리를 추가하여 NPE 방지

        String token = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 1000))
                .withClaim("id", id) // id 토큰으로 전달
                .withClaim("username", member.getUsername()) // username 토큰으로 전달
                .withClaim("alias", member.getAlias()) // alias 추가
                .withClaim("role", member.getRole().toString()) // role 추가
                .sign(Algorithm.HMAC256("com.lead.jwt"));

        res.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        res.setStatus(HttpStatus.OK.value());
    }
    
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        // 예외 메시지 확인
        String message;
        if (failed instanceof DisabledException) {
            message = "탈퇴한 아이디입니다."; // 비활성화된 계정일 때 메시지 설정
        } else {
            message = "로그인 실패: " + failed.getMessage();
        }

        // 응답에 메시지 반환
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

}

//@Slf4j
//@RequiredArgsConstructor
//public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
//
//	private final AuthenticationManager authenticationManager;
//	
//	public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res){
//		
//		ObjectMapper mapper = new ObjectMapper();
//		try {
//			Member member = mapper.readValue(req.getInputStream(), Member.class);
//			Authentication authToken = new UsernamePasswordAuthenticationToken(member.getUsername(), member.getPw());
//			return authenticationManager.authenticate(authToken);
//		}catch(Exception e) {
//			log.info(e.getMessage());
//		}
//		res.setStatus(HttpStatus.UNAUTHORIZED.value());
//		return null;
//	}
//	
//	protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException, ServletException {
//		log.info("successfulAuthentication");
//		User user = (User)authResult.getPrincipal();
//		String token = JWT.create()
//				.withExpiresAt(new Date(System.currentTimeMillis()+1000*60*1000))
//				.withClaim("username", user.getUsername())
//				.sign(Algorithm.HMAC256("com.lead.jwt"));
//		res.addHeader(HttpHeaders.AUTHORIZATION,"Bearer "+ token);
//		res.setStatus(HttpStatus.OK.value());
//	}
//}