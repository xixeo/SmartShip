package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.OrdersDTO;
import com.lead.service.OrderDetailService;
import com.lead.service.OrdersService;

@RestController
public class ScheduleController {

	@Autowired
	private OrdersService ordersService;

	@Autowired
	private OrderDetailService orderDetailService;

	@GetMapping("/scheduleAll")
	public ResponseEntity<?> getOrders() {
	    try {
	        System.out.println("===========================전체 스케줄 검색한다");
	        List<OrdersDTO> orders = ordersService.getOrdersWithDetails();
	        
	        // 정상적으로 스케줄 목록 반환
	        return ResponseEntity.ok(orders);

	    } catch (RuntimeException e) {
	        // 예외 발생 시 오류 메시지 반환
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("스케줄 조회 중 오류 발생: " + e.getMessage());
	    }
	}


	@GetMapping("/schedule")
	public ResponseEntity<?> getSchedule(@RequestParam(required = false) Integer orderId) {
	    try {
	        if (orderId != null) {
	            System.out.println("===========================Orders 조회 한다");
	            // 특정 OrderId로 OrderDetail 조회
	            return ResponseEntity.ok(orderDetailService.getOrderDetailsByOrderId(orderId));
	        } else {
	            System.out.println("===========================OrderDetail 조회 한다");
	            // 전체 Orders 조회
	            return ResponseEntity.ok(ordersService.getOrders());
	        }
	    } catch (RuntimeException e) {
	        // 예외 발생 시 오류 메시지 반환
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("스케줄 조회 중 오류 발생: " + e.getMessage());
	    }
	}


}
