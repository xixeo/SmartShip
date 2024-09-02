package com.lead.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "category2")
public class Category2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category2_id") 
    private Integer category2_id;  

    @Column(name = "category1_id", nullable = false) 
    private Integer category1_id;  

    @Column(name = "category2_name", nullable = false)
    private String category2_name;
}
