package com.lead.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lead.entity.Member;
import com.lead.repository.MemberRepo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SecurityUserDetailsService implements UserDetailsService {

	@Autowired private MemberRepo memRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Member member = memRepo.findById(username).orElseThrow(()->new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
		
		if (!member.isEnabled()) {
	        // 비활성화된 계정에 대한 처리
	        throw new DisabledException("탈퇴한 아이디입니다.");
	    }
		
		log.info("loaduserbyname");
		return new User(member.getUsername(), member.getPw(), AuthorityUtils.createAuthorityList(member.getRole().toString()));
	}
}
