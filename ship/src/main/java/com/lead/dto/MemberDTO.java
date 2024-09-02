package com.lead.dto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {

    private String username;
    private String alias;
    private String role;
    private boolean enabled;
}
