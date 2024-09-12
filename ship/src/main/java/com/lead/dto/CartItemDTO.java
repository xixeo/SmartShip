package com.lead.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
	private Integer cartItemId;
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
    private Integer leadtime;
    private boolean isSell;    
}
