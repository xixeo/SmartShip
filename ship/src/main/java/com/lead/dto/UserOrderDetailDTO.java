package com.lead.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class UserOrderDetailDTO {
	private Integer orderDetailId;
    private Integer itemsId;
    private String itemName;
    private String part1;
    private BigDecimal price;
    private String unit;
    private Integer quantity;
    private String username;
    private LocalDate orderDate;
    private Boolean cancel;
}