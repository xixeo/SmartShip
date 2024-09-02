package com.lead.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHeaderDTO {

    private int orderId;
    private String listName;
    private Date releaseDate;
}
