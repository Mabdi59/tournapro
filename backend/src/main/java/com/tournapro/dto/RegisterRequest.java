package com.tournapro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName; // optional

    @NotBlank
    @Email
    private String email; // required, unique

    @NotBlank
    @Size(min = 8)
    private String password; // required

    @NotBlank
    private String confirmPassword; // required
}
