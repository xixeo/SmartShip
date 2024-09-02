package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultLeadTimeDTO {

    private int rltId;
    private int itemsId; // Items ID
    private int preLeadtimeId; // Predicted Lead Time ID
}
