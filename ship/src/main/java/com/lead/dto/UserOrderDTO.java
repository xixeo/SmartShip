package com.lead.dto;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOrderDTO {
	private Integer orderId;
	private String username;
	private String alias;
	private LocalDate orderDate;
	private String memo;
	private List<OrderDetailDTO> orderDetails;
}
