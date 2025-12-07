package com.tournapro.dto;

import java.time.LocalDateTime;

public class AdministratorResponse {

    private Long id;
    private String email;
    private String rights;
    private LocalDateTime createdAt;

    public AdministratorResponse() { }

    public AdministratorResponse(Long id, String email, String rights, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.rights = rights;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRights() {
        return rights;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRights(String rights) {
        this.rights = rights;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

