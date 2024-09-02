package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {

    private int orderDetailId;
    private int orderId; // Order Header ID
    private int itemsId; // Items ID
    private int quantity;
    private double price;
}
