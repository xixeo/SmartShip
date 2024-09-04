package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.OrderDetailDTO;
import com.lead.service.OrderDetailService;

@RestController
@RequestMapping("/schedule")
public class OrderDetailController {

	 @Autowired
	    private OrderDetailService orderDetailService;

	    @GetMapping("/{orderId}")
	    public List<OrderDetailDTO> getOrderDetails(@PathVariable Integer orderId) {
	        return orderDetailService.getOrderDetailsByOrderId(orderId);
	    }
}
