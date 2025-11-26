package com.tournapro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DivisionRequest {
    @NotBlank
    private String name;
    
    private String description;
}
