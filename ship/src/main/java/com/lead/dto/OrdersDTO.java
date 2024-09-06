package com.lead.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrdersDTO {

	private Integer orderId;
	private String listName;
	private LocalDate releaseDate;
	private LocalDate bestOrderDate;
	private String alias;
	private List<OrderDetailDTO> orderDetails;
}
