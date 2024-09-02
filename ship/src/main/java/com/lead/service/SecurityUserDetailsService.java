package com.lead.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import com.lead.entity.Member;
import com.lead.repository.MemberRepo;

@Slf4j
@Service
public class SecurityUserDetailsService implements UserDetailsService {

	@Autowired private MemberRepo memRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Member member = memRepo.findById(username).orElseThrow(()->new UsernameNotFoundException("Not Found username"));
		log.info("loaduserbyname");
		return new User(member.getUsername(), member.getPw(), AuthorityUtils.createAuthorityList(member.getRole().toString()));
	}
}
