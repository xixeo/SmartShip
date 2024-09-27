package com.lead.dto;

import com.lead.entity.Season;
import com.lead.entity.SelectedDay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadtimeDTO {
    private Integer leadtimeId;
    private Integer itemsId;  
    private Integer leadtime; 
    private Season season;
    private SelectedDay selectedDay;
}