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
		return ordersService.getOrdersWithDetails();
	}

	@GetMapping("/schedule")
	public Object getSchedule(@RequestParam(required = false) Integer orderId) {
		if (orderId != null) {
			return orderDetailService.getOrderDetailsByOrderId(orderId);
		} else {
			return ordersService.getOrders();
		}
	}

}
