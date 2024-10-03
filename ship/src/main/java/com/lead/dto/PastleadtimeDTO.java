package com.lead.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PastleadtimeDTO {
    private Integer pastleadtimeId;
    private Integer itemsId;  
    private Integer pastleadtime; 
    private LocalDate orderdate;
    private LocalDate arrdate;
    
}