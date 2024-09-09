package com.lead.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
	
	// 주문 수정
	@PutMapping("/newOrder/{orderId}")
	public ResponseEntity<OrdersDTO> updateOrder(@PathVariable Integer orderId, @RequestBody OrderRequestDTO orderRequest) {
		OrdersDTO updatedOrder = ordersService.updateOrder(orderId, orderRequest);
		System.out.println("===========================주문 넣었다");
		return ResponseEntity.ok(updatedOrder);
	}
	
	 // 주문과 날짜로 조회
    @GetMapping("/order/{orderId}/releaseDate/{releaseDate}")
    public ResponseEntity<OrdersDTO> getOrderByIdAndReleaseDate(
            @PathVariable Integer orderId,
            @PathVariable LocalDate releaseDate) {
        OrdersDTO order = ordersService.getOrderByIdAndReleaseDate(orderId, releaseDate);
        return ResponseEntity.ok(order);
    }
}
