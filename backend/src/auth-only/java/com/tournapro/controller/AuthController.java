package com.tournapro.controller;

import com.tournapro.dto.AuthResponse;
import com.tournapro.dto.LoginRequest;
import com.tournapro.dto.RegisterRequest;
import com.tournapro.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.tournapro.dto.ForgotPasswordRequest request) {
        return ResponseEntity.ok(Map.of("message", "If an account exists for that email, a reset link has been sent."));
    }
}

