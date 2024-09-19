package com.lead.dto;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemRecommendDTO {
	   private Integer itemsId;
	    private String itemName;
	    private BigDecimal price;
	    private String unit;
	    private String supplierName;
	    private Integer leadtime;
	    private LocalDate recommendedOrderDate;
}
