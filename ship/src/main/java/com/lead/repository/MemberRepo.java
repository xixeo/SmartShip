package com.lead.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Member;


public interface MemberRepo extends JpaRepository<Member, String>{
	
	//public Member findByEmail(String email); 

}
