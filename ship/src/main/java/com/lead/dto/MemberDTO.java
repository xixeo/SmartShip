package com.lead.dto;

import java.time.LocalDate;

import com.lead.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {

    private String username;
    private String alias;
    private Role role;
    private String phone;
    private String etc;
    private LocalDate regdate;
    private boolean enabled;
}
