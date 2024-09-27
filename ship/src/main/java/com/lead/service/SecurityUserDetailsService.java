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

@Service
@Slf4j
public class SecurityUserDetailsService implements UserDetailsService {

    @Autowired
    private MemberRepo memRepo;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        // id를 기반으로 사용자를 찾는다
        Member member = memRepo.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // 계정이 비활성화되어 있으면 예외 처리
        if (!member.isEnabled()) {
            throw new DisabledException("탈퇴한 아이디입니다.");
        }

        log.info("사용자 로드: " + id);

        // UserDetails 반환 (id, 비밀번호, 권한 정보)
        return new User(member.getId(), member.getPw(),
            AuthorityUtils.createAuthorityList(member.getRole().toString()));
    }
}
