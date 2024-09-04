package com.lead.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDetailDTO {
	private Integer orderDetailId;
    private String itemName;
    private String category1Name;
    private String category2Name;
    private String category3Name;
    private Integer quantity;
    private BigDecimal price;
    private String unit;
    private String supplierName;
    private String alias;
}