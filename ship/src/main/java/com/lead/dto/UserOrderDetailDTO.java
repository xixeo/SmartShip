package com.lead.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class UserOrderDetailDTO {
	private Integer orderDetailId;
//    private String category1Name;
//    private String category2Name;
//    private String category3Name;
    private Integer itemsId;
    private String itemName;
    private BigDecimal price;
    private String unit;
    private Integer quantity;
    private String username;
//    private LocalDate recommendedOrderDate;
}