package com.lead.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lead.entity.Member;
import com.lead.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService memService; 
	
	@PostMapping("/signup")
	public ResponseEntity<String> joinMembers(@RequestBody Member member) {
	    try {
	        System.out.println("===========================회원가입 한다");
	        String result = memService.joinMembers(member); // 회원가입 로직 처리
	        return ResponseEntity.ok(result); // 성공 메시지 반환

	    } catch (RuntimeException e) {
	        // 예외 발생 시 오류 메시지 반환
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생: " + e.getMessage());
	    }
	}

	
	@PostMapping("/unsub")
	public ResponseEntity<String> unsubMember() {
        // JWT 토큰에서 사용자 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // 토큰에서 username 추출

        try {
        	memService.unsubMember(username);
        	System.out.println("===========================회원탈퇴 한다");
            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원탈퇴 처리 중 오류가 발생했습니다.");
        }
    }
}
