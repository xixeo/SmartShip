package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Member;


public interface MemberRepo extends JpaRepository<Member, String>{
	
	Optional<Member> findByUsername(String username); // JWTAuthenticationFilter에서 alias를 보내기 위해 repo작성

}
