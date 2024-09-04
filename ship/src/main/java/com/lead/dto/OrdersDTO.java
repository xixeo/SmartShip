package com.lead.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrdersDTO {

	private Integer orderId;
	private String listName;
	private Date releaseDate;
	private Date bestOrderDate;
	private String alias;
	
}
