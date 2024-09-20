package com.lead.entity;

import java.time.LocalDate;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "release_date", nullable = true)
    private LocalDate releaseDate;
    
    @Column(name = "best_order_date", nullable = true)
    private LocalDate bestOrderDate;
    
    @Column(name = "request_date", nullable = true)
    private LocalDate requestDate;
    
    @Column(name = "memo", nullable = true)
    private String memo;

    @ManyToOne
    @JoinColumn(name = "username", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "order")
    private Set<OrderDetail> orderDetails;
}