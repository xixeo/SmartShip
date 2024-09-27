package com.lead.dto;

import java.util.List;

import com.lead.entity.SelectedDay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequestDTO {
    private List<CartItemRequestDTO> cartItems;
    String memo;
    SelectedDay selectedDay;
}
