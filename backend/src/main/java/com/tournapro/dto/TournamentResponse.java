package com.tournapro.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TournamentResponse {

    private Long id;
    private String title;
    private String primaryVenue;
    private LocalDate startDate;
    private LocalDateTime createdAt;

    public TournamentResponse() { }

    public TournamentResponse(Long id, String title, String primaryVenue,
                              LocalDate startDate, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.primaryVenue = primaryVenue;
        this.startDate = startDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPrimaryVenue() {
        return primaryVenue;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPrimaryVenue(String primaryVenue) {
        this.primaryVenue = primaryVenue;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
