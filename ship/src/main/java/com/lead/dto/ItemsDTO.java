package com.lead.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemsDTO {

	private String itemName;
    private String category1Name;
    private String category2Name;
    private String part1;
    private String part2;
    private BigDecimal price;
    private String unit;
    private String supplierName;
}
