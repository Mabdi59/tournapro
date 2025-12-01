package com.tournapro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Player Request DTO - Used for creating and updating players
 * File: backend/src/main/java/com/tournapro/dto/PlayerRequest.java
 */
public class PlayerRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    private Integer jerseyNumber;

    @Size(max = 50)
    private String position;

    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    private Long teamId;

    public PlayerRequest() {}

    public PlayerRequest(String name, Long teamId) {
        this.name = name;
        this.teamId = teamId;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getJerseyNumber() { return jerseyNumber; }
    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
}
