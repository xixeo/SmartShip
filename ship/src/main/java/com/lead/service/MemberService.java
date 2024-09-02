package com.lead.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lead.entity.Member;
import  com.lead.entity.Role;
import  com.lead.repository.MemberRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepo memberRepo; 
	private final PasswordEncoder passwordEncoder; 

	public Member getMemberById(String id) {
		return memberRepo.findById(id).get();
	}

	public String joinMembers(Member member) {
		String username = member.getUsername(); 
		Optional <Member> memberByUsername = memberRepo.findById(username); 

		if (memberByUsername.isPresent()) {

			if (memberByUsername.get().isEnabled() == true)
				return "이미 가입된 사용자 입니다.";		
			else 
				return "사용할 수 없는 아이디 입니다.";
		
		}			
		else {
			member.setRole(Role.ROLE_USER);
			member.setEnabled(true);
			member.setPw(passwordEncoder.encode(member.getPw()));
			memberRepo.save(member);
			return username + "님, 가입을 축하합니다!";
		}				
	}

	public String unsubMembers(User user) {
		String username = user.getUsername(); 
		Member member = memberRepo.findById(username).get();
		member.setEnabled(false);
		memberRepo.save(member);
		return username + "님, 정상적으로 탈퇴되었습니다" ;
	}
}
