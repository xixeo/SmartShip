package com.lead.dto;

import java.math.BigDecimal;

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
public class ItemsDTO {
    private Integer itemId;
    private String category1Name;
    private String category2Name;
    private String category3Name;    
    private String itemName;
    private String part1;
    private String part2;
    private BigDecimal price;
    private String unit;
    private String alias;
    private String username;  // 사용자의 이름
    private Integer leadtime; // 리드타임
}