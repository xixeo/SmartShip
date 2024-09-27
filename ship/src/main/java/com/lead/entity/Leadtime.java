package com.lead.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "leadtime1")
public class Leadtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leadtime_id", nullable = false)
    private Integer leadtimeId;

    @ManyToOne
    @JoinColumn(name = "items_id", referencedColumnName = "items_id", nullable = false)
    private Items items; 

    
    @Column(name = "leadtime", nullable = false)
    private Integer leadtime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "season", nullable = false)
    private Season season;    
    
    @Enumerated(EnumType.STRING)
    @Column(name = "selected_day", nullable = false)
    private SelectedDay selectedDay;   
    
}