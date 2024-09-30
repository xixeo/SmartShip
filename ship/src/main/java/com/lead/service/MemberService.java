package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.MemberDTO;
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
		return memberRepo.findById(id).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
	}

	public String joinMembers(Member member) {
		String id = member.getId();
		String phone = member.getPhone();
		
		// 휴대폰 번호가 null이거나 빈 문자열인지 확인 (필수값 체크)
	    if (phone == null || phone.trim().isEmpty()) {
	        return "휴대폰 번호는 필수 입력 항목입니다.";
	    }

		// 사용자 이름으로 회원 조회
		Optional<Member> memberById = memberRepo.findById(id);

		// 휴대폰 번호로 회원 조회
		//Optional<Member> memberByPhone = memberRepo.findByPhone(phone);

		if (memberById.isPresent()) {
			if (memberById.get().isEnabled()) {
				return "이미 가입된 사용자입니다.";
			} else {
				return "사용할 수 없는 아이디입니다.";
			}
		}

		// 이미 등록된 휴대폰 번호 확인
//		if (memberByPhone.isPresent()) {
//			return "이미 등록된 번호입니다.";
//		}

		System.out.println("Setting role: " + member.getRole());

		member.setRole(member.getRole()); // ROLE 사용자에게 입력받음
		member.setEnabled(true);
		member.setPw(passwordEncoder.encode(member.getPw()));
		member.setPhone(phone);
		member.setRegdate(LocalDate.now());
		memberRepo.save(member);
		return id + "님, 가입을 축하합니다!";

	}
	
	public String testMembers(Member member) {
		String id = member.getId();
		
		// 사용자 이름으로 회원 조회
		Optional<Member> testId = memberRepo.findById(id);
		System.out.println(testId);
		
		if(testId.isPresent() ) {
			return "이미 존재하는 id입니다.";
		}
		return "사용 가능한 아이디입니다.";
		
	}

	@Transactional
	public String unsubMember(String id) {
		Member member = memberRepo.findById(id).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

		// enabled 값을 0으로 변경하여 회원 탈퇴 처리
		member.setEnabled(false); // TINYINT(1)에서 0은 false, 1은 true로 해석됨
		memberRepo.save(member); // 변경사항 저장

		// 회원 탈퇴 완료 메시지 반환
		return id + " 회원탈퇴가 정상적으로 처리되었습니다.";
	}

	///////////////////////////////////////////////////////// 회원 조회
	public List<MemberDTO> getMemberAll(Authentication authentication) {

		// 현재 사용자가 ADMIN인지 확인
		if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
			throw new RuntimeException("회원 조회 권한이 없습니다.");
		}

		List<Member> members = memberRepo.findAll();
		return members.stream().map(member -> new MemberDTO(member.getId(), member.getUsername(), member.getAlias(), member.getRole(),
				member.getPhone(), member.getEtc(), member.getRegdate(), member.isEnabled())).collect(Collectors.toList());
	}

	///////////////////////////////////////////////////////// 회원 수정
	public void updateMember(Authentication authentication, String id, String username, String alias, Role role, String phone,
			Boolean enabled, String etc) {
		// 현재 사용자가 ADMIN인지 확인
		if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
			throw new RuntimeException("회원 조회 권한이 없습니다.");
		}

		// URL로 전달된 username으로 회원 정보 조회
		Member member = memberRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

		// 회원 정보 업데이트
		member.setUsername(username);
		member.setAlias(alias);
		member.setRole(role); // 받은 role 값을 설정
		member.setPhone(phone);
		member.setEnabled(enabled); // 받은 enabled 값을 설정
		member.setEtc(etc);

		// 회원 정보 저장
		memberRepo.save(member);
	}
	
///////////////////////////////////////////////////////// 회원 공지 조회
	 // username을 통해 userId를 조회하는 메서드
	  public Member findMemberById(String id) {
	        return memberRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + id));
	    }
}
