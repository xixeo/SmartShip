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
@Table(name = "Member")
public class Member {

    @Id
    private String username;

    @Column(nullable = false)
    private String pw;

    @Column(nullable = false)
    private String alias;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role; 

    @Column(nullable = false)
    private boolean enabled;

}
