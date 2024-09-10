package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Cart;
import com.lead.entity.Member;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {

	Optional<Cart> findByMember(Member member);
}
