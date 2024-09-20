package com.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class OrderDetailUpdateDTO {
	private Integer orderDetailId;
    private Integer itemsId;
    private Integer quantity;
}