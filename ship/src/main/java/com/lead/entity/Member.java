package com.lead.entity;

import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Member")
public class Member {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String pw;

    @Column(nullable = false)
    private String alias;

    @Enumerated(EnumType.STRING)
    private Role role;    

    @Column(nullable = false)
    private boolean enabled;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = true)
    private String etc;
    
    @Column(name = "regdate", nullable = false)
    private LocalDate regdate;

    @OneToMany(mappedBy = "member")
    private Set<Orders> orders;
    
    @OneToMany(mappedBy = "member")
    private Set<Items> items;
}