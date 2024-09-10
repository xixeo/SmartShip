package com.lead.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartRequestDTO {

	private String username;
    private List<CartItemRequestDTO> cartItems;
}
