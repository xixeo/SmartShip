package com.lead.dto;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerOrderDTO {
	private Integer orderId;
	private String username;
	private String alias;
	private LocalDate requestDate;
	private LocalDate releaseDate;
	private String memo;
	private Map<LocalDate, List<ManagerOrderDetailDTO>> groupedOrderDetails;
}
