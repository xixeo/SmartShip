package com.lead.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
	private Integer cartId;
	private String username;
	private String alias;
	private LocalDate releaseDate;
	private LocalDate bestOrderDate;
	private LocalDateTime createdAt;
	private List<CartItemDTO> cartItems;
}