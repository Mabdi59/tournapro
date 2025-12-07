package com.tournapro.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CreatePlayerRequest {

    @NotBlank
    private String name;

    private LocalDate dob;

    private Integer number;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }
}

