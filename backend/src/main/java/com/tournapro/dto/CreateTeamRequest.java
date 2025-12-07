package com.tournapro.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTeamRequest {

    @NotBlank
    private String name;

    private String shortName;
    private String email;
    private String country;
    private String logoUrl;
    private String dressingRoom;

    private Boolean present;
    private Boolean paid;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getDressingRoom() {
        return dressingRoom;
    }

    public void setDressingRoom(String dressingRoom) {
        this.dressingRoom = dressingRoom;
    }

    public Boolean getPresent() {
        return present;
    }

    public void setPresent(Boolean present) {
        this.present = present;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }
}
