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
@Table(name = "Result_LeadTime")
public class ResultLeadTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rltId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "items_id", nullable = false)
    private Items items;

    @Column(nullable = false)
    private int preLeadtimeId;
}
