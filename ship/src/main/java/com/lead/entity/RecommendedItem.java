package com.lead.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommended_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recommendedId;

    @ManyToOne
    @JoinColumn(name = "items_id", nullable = false)
    private Items item;

    @ManyToOne
    @JoinColumn(name = "recommended_items_id", nullable = false)
    private Items recommendedItem;
}