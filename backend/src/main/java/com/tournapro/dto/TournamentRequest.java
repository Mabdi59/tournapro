package com.tournapro.dto;

import com.tournapro.entity.Tournament;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TournamentRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotBlank
    private String location;

    @NotNull
    private Tournament.TournamentFormat format;
}
