package com.lead.entity;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Category2")
public class Category2 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category2_id", nullable = false)
    private Integer category2Id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category1 category1;

    @Column(name = "category2_name", nullable = false)
    private String category2Name;
    
    @OneToMany(mappedBy = "category2")
    private Set<Category3> category3Set;
    
}
