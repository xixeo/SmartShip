package com.lead.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrdersDTO {

	private Integer orderId;
	private String username;
	private String alias;
	private LocalDate releaseDate;
	private LocalDate bestOrderDate;
	private LocalDate orderDate;
//	private String memo;
	private List<OrderDetailDTO> orderDetails;
}