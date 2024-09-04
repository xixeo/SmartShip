package com.lead.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Orders;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Integer> {

}
