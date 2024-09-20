package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Orders;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Integer> {
	
	List<Orders> findByMemberUsername(String username);
}
