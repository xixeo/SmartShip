package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category2DTO {

    private int category2Id;
    private int category1Id; // Parent Category ID
    private String category2Name;
}
