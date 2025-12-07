package com.tournapro.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlayerResponse {

    private Long id;
    private String name;
    private LocalDate dob;
    private Integer number;
    private LocalDateTime createdAt;

    public PlayerResponse() {}

    public PlayerResponse(Long id, String name, LocalDate dob, Integer number, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.number = number;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public Integer getNumber() {
        return number;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

