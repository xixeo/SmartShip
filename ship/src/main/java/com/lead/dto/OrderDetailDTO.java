package com.lead.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class OrderDetailDTO {
	private Integer orderDetailId;
    private String category1Name;
    private String category2Name;
    private String category3Name;
    private Integer itemsId;
    private String itemName;
    private Integer quantity;
    private BigDecimal price;
    private String unit;
    private String username;
    private LocalDate recommendedOrderDate;
}