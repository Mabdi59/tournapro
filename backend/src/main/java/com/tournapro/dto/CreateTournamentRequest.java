package com.tournapro.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CreateTournamentRequest {

    @NotBlank
    private String title;

    // both optional for now – you can add @NotNull later if you want to require them
    private LocalDate startDate;
    private String primaryVenue;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getPrimaryVenue() {
        return primaryVenue;
    }

    public void setPrimaryVenue(String primaryVenue) {
        this.primaryVenue = primaryVenue;
    }
}
