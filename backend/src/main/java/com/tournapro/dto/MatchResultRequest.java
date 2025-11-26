package com.tournapro.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MatchResultRequest {
    @NotNull
    private Integer team1Score;
    
    @NotNull
    private Integer team2Score;
}
