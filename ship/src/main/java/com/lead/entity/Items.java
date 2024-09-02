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
@Table(name = "items")
public class Items {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "items_id")
    private Integer itemId;

    @Column(name = "category2_id", nullable = false)
    private Integer category2Id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "part1")
    private String part1;

    @Column(name = "part2")
    private String part2;

    @Column(name = "price")
    private Double price;

    @Column(name = "supplier_id", nullable = false)
    private Integer supplierId;

    // Category2와의 관계
    @ManyToOne
    @JoinColumn(name = "category2_id", insertable = false, updatable = false)
    private Category2 category2;

    // Suppliers와의 관계
    @ManyToOne
    @JoinColumn(name = "supplier_id", insertable = false, updatable = false)
    private Suppliers supplier;
}
