package com.tournapro.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // keep username for display but make it nullable to allow email-based login
    @Column(unique = true, nullable = true)
    private String username;

    // Map the entity field to the existing DB column name `password_hash` so inserts/updates target the correct column
    @Column(name = "password_hash", nullable = true)
    private String password;

    // Make email unique and not null for new users
    @Column(unique = true, nullable = false)
    private String email;

    // Optional full name
    @Column(nullable = true)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Use wrapper Boolean (nullable) so Hibernate creates a nullable column instead of NOT NULL for primitive
    @Column(nullable = true)
    private Boolean enabled = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(enabled);
    }

    // Override the UserDetails#getUsername to return the email address so the JWT (which uses email as subject)
    // and UserDetails are consistent. This fixes token validation where jwt subject (email) was compared
    // to a nullable `username` display field.
    @Override
    public String getUsername() {
        return this.email;
    }

    public enum Role {
        ORGANIZER, REFEREE, ADMIN
    }
}
