package com.lead.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.MemberDTO;
import com.lead.entity.Member;
import com.lead.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService memService; 
	//회원 가입
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

	//회원 탈퇴
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
	
	//회원 조회
	@GetMapping("/member")
	public ResponseEntity<?> getMemberAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		   try {
		        System.out.println("===========================전체 회원 조회한다");
		        List<MemberDTO> members = memService.getMemberAll(authentication);
		        
		        // 정상적으로 스케줄 목록 반환
		        return ResponseEntity.ok(members);

		    } catch (RuntimeException e) {
		        // 예외 발생 시 오류 메시지 반환
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류 발생: " + e.getMessage());
		    }
	}
	
	//회원 수정
	@PutMapping("/updateMember/{username}")
	public ResponseEntity<String> updateNotice(Authentication authentication,
            @PathVariable String username,
            @RequestBody MemberDTO memberDTO) {

	    try {
	        // 공지사항 수정 로직 호출
	        memService.updateMember(authentication, username, 
	        		 memberDTO.getAlias(), 
                     memberDTO.getRole(),
                     memberDTO.getPhone(), 
                     memberDTO.isEnabled(), 
                     memberDTO.getEtc());
	        return ResponseEntity.ok("회원 정보가 성공적으로 수정되었습니다.");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류가 발생했습니다." + e.getMessage());
	    }
	}

}
