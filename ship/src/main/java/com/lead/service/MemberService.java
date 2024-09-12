package com.lead.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.entity.Member;
import com.lead.repository.MemberRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepo memberRepo; 
    private final PasswordEncoder passwordEncoder; 

    public Member getMemberById(String id) {
        return memberRepo.findById(id).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
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
            System.out.println("Setting role: " + member.getRole());
            
//            member.setRole(Role.ROLE_USER); // Use Role.ROLE_USER
            member.setRole(member.getRole()); // Use Role.ROLE_USER
            member.setEnabled(true);
            member.setPw(passwordEncoder.encode(member.getPw()));
            memberRepo.save(member);
            return username + "님, 가입을 축하합니다!";
        }
    }

    @Transactional
    public String unsubMember(String username) {
        Member member = memberRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // enabled 값을 0으로 변경하여 회원 탈퇴 처리
        member.setEnabled(false); // TINYINT(1)에서 0은 false, 1은 true로 해석됨
        memberRepo.save(member); // 변경사항 저장

        // 회원 탈퇴 완료 메시지 반환
        return username + " 회원탈퇴가 정상적으로 처리되었습니다.";
    }

}
