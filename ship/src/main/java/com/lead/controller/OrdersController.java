package com.lead.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.OrderDetailDTO;
import com.lead.service.OrderDetailService;

@RestController
public class OrdersController {

	@Autowired
	private OrderDetailService orderDetailService;

	// orderDetail 업데이트
	@PutMapping("/orderUpdate")
	public ResponseEntity<OrderDetailDTO> updateOrderDetail(@RequestParam Integer orderDetailId,
			@RequestParam Integer newQuantity, @RequestParam Integer newItemId) {
		OrderDetailDTO updatedOrderDetail = orderDetailService.updateOrderDetail(orderDetailId, newQuantity,
				newItemId);
		return ResponseEntity.ok(updatedOrderDetail);
	}

//	@Autowired
//	private OrdersService ordersService;
//
//	// 주문 생성
//	@PostMapping("/newOrder")
//	public ResponseEntity<OrdersDTO> createOrder(@RequestBody OrderRequestDTO orderRequest) {
//		OrdersDTO createdOrder = ordersService.createOrder(orderRequest);
//		System.out.println("===========================장바구니 넣었다");
//		return ResponseEntity.ok(createdOrder);
//	}
//	
//	// 주문 수정
//	@PutMapping("/newOrder/{orderId}")
//	public ResponseEntity<OrdersDTO> updateOrder(@PathVariable Integer orderId, @RequestBody OrderRequestDTO orderRequest) {
//		OrdersDTO updatedOrder = ordersService.updateOrder(orderId, orderRequest);
//		System.out.println("===========================주문 넣었다");
//		return ResponseEntity.ok(updatedOrder);
//	}
//	
//	 // 주문과 날짜로 조회
//    @GetMapping("/order/{orderId}/releaseDate/{releaseDate}")
//    public ResponseEntity<OrdersDTO> getOrderByIdAndReleaseDate(
//            @PathVariable Integer orderId,
//            @PathVariable LocalDate releaseDate) {
//        OrdersDTO order = ordersService.getOrderByIdAndReleaseDate(orderId, releaseDate);
//        return ResponseEntity.ok(order);
//    }
}
