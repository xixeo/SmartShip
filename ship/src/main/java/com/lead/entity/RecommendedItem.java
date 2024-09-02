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
@Table(name = "Recommended_Item")
public class RecommendedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recommendedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "items_id", nullable = false)
    private Items items;

    @Column(nullable = false)
    private int recommendedItemsId;
}
