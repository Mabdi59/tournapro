package com.tournapro.dto;

import com.tournapro.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private User.Role role;
    private String token;
}
