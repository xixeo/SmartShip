package com.lead.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class OrderDetailDTO {
	private Integer orderDetailId;
    private String itemName;
    private Integer quantity;
    private BigDecimal price;
    private String unit;
    private String username;
}