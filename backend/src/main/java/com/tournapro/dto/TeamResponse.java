package com.tournapro.dto;

import java.time.LocalDateTime;

public class TeamResponse {

    private Long id;
    private String name;
    private String shortName;
    private String email;
    private String country;
    private String logoUrl;
    private String dressingRoom;
    private Boolean present;
    private Boolean paid;
    private LocalDateTime createdAt;

    public TeamResponse() {}

    public TeamResponse(Long id, String name, String shortName, String email, String country, String logoUrl, String dressingRoom, Boolean present, Boolean paid, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.email = email;
        this.country = country;
        this.logoUrl = logoUrl;
        this.dressingRoom = dressingRoom;
        this.present = present;
        this.paid = paid;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getShortName() {
        return shortName;
    }

    public String getEmail() {
        return email;
    }

    public String getCountry() {
        return country;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getDressingRoom() {
        return dressingRoom;
    }

    public Boolean getPresent() {
        return present;
    }

    public Boolean getPaid() {
        return paid;
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

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public void setDressingRoom(String dressingRoom) {
        this.dressingRoom = dressingRoom;
    }

    public void setPresent(Boolean present) {
        this.present = present;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
