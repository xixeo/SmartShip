package com.lead.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lead.entity.Member;
import com.lead.entity.Role;
import com.lead.repository.MemberRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepo memberRepo; 
    private final PasswordEncoder passwordEncoder; 

    public Member getMemberById(String id) {
        return memberRepo.findById(id).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public String joinMembers(Member member) {
        String username = member.getUsername(); 
        Optional<Member> memberByUsername = memberRepo.findById(username); 

        if (memberByUsername.isPresent()) {
            if (memberByUsername.get().isEnabled()) {
                return "이미 가입된 사용자입니다.";		
            } else {
                return "사용할 수 없는 아이디입니다.";
            }
        } else {
        	 // Log the role before saving
            System.out.println("Setting role: " + member.getRole());
            
            member.setRole(Role.ROLE_USER); // Use Role.ROLE_USER
            member.setEnabled(true);
            member.setPw(passwordEncoder.encode(member.getPw()));
            memberRepo.save(member);
            return username + "님, 가입을 축하합니다!";
        }
    }

    public String unsubMembers(User user) {
        String username = user.getUsername(); 
        Member member = memberRepo.findById(username).orElseThrow(() -> new RuntimeException("Member not found"));
        member.setEnabled(false);
        memberRepo.save(member);
        return username + "님, 정상적으로 탈퇴되었습니다";
    }
}
