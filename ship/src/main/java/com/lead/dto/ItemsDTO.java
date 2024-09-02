package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemsDTO {

    private int itemsId;
    private int category2Id; // Category2 ID
    private String itemName;
    private String part1;
    private String part2;
    private double price;
    private String unit;
    private int supplierId; // Supplier ID
}
