package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedItemDTO {

    private int recommendedId;
    private int itemsId; // Items ID
    private int recommendedItemsId; // Recommended Items ID
}
