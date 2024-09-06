package com.lead.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderRequestDTO {

	private String releaseDate; // release_date는 String으로 받고 나중에 변환
	private String orderDate;
	private String bestOrderDate;
	private Integer itemId;
	private BigDecimal price;
	private String alias;
	private String memo;
	
	// 아이템 리스트
	private List<OrderItemRequestDTO> itemDetails; 
}
