package com.lead.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.OrderRequestDTO;
import com.lead.dto.OrdersDTO;
import com.lead.service.OrdersService;

@RestController
public class OrdersController {

	@Autowired
	private OrdersService ordersService;

	// 주문 생성
	@PostMapping("/newOrder")
	public ResponseEntity<OrdersDTO> createOrder(@RequestBody OrderRequestDTO orderRequest) {
		OrdersDTO createdOrder = ordersService.createOrder(orderRequest);
		System.out.println("===========================장바구니 넣었다");
		return ResponseEntity.ok(createdOrder);
	}
	 
	@PutMapping("/newOrder/{orderId}")
	public ResponseEntity<OrdersDTO> updateOrder(@PathVariable Integer orderId, @RequestBody OrderRequestDTO orderRequest) {
		OrdersDTO updatedOrder = ordersService.updateOrder(orderId, orderRequest);
		System.out.println("===========================주문 넣었다");
		return ResponseEntity.ok(updatedOrder);
	}
}
