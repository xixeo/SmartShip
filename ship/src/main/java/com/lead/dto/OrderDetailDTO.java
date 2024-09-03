package com.lead.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDetailDTO {
    private String supplierName;
    private String category1Name;
    private String category2Name;
    private Integer quantity;
    private BigDecimal price;
    private String unit;
}