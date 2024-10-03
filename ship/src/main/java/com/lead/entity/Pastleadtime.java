package com.lead.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "pastleadtime")
public class Pastleadtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pastleadtime_id", nullable = false)
    private Integer pastleadtimeId;

    @ManyToOne
    @JoinColumn(name = "items_id", referencedColumnName = "items_id", nullable = false)
    private Items items; 

    
    @Column(name = "pastleadtime", nullable = false)
    private Integer pastleadtime;
    
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;
    
    @Column(name = "arr_date", nullable = false)
    private LocalDate arrDate;
}