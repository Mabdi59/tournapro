package com.tournapro.service;

import com.tournapro.dto.AuthResponse;
import com.tournapro.dto.LoginRequest;
import com.tournapro.dto.RegisterRequest;
import com.tournapro.entity.User;
import com.tournapro.exception.EmailAlreadyUsedException;
import com.tournapro.repository.UserRepository;
import com.tournapro.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException("Email already in use");
        }

        User user = new User();
        // username left null (optional display field)
        user.setUsername(null);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(User.Role.ORGANIZER); // default role
        user.setEnabled(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), token);
    }

    public AuthResponse login(LoginRequest request) {
        // authenticate using email as principal
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), token);
    }
}
