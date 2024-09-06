package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public List<OrdersDTO> getOrders() {
		System.out.println("===========================전체 스케줄 검색한다");
		return ordersService.getOrdersWithDetails();
	}

	@GetMapping("/schedule")
	public Object getSchedule(@RequestParam(required = false) Integer orderId) {
		if (orderId != null) {
			System.out.println("===========================Orders 조회 한다");
			return orderDetailService.getOrderDetailsByOrderId(orderId);
		} else {
			System.out.println("===========================OrderDetail 조회 한다");
			return ordersService.getOrders();
		}
	}

}
