package com.lead.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
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
	public String joinMembers(@RequestBody Member member) {
		System.out.println("===========================회원가입 한다");
		return memService.joinMembers(member); 
	}
	
	@PostMapping("/members/unsub")
	public String unsubMembers(@AuthenticationPrincipal User user) {
		return memService.unsubMembers(user);
	}
}
