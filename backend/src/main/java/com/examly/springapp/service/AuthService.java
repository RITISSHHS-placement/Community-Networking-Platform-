package com.examly.springapp.service;

import com.examly.springapp.config.JwtUtil;
import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.entity.Role;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered");
        }

        Role role;
        try {
            role = Role.valueOf(req.getRole().toUpperCase().replace(' ', '_'));
        } catch (IllegalArgumentException ex) {
            role = Role.MEMBER;
        }
        // Operational roles require supervisor approval before activation (FR1) —
        // real deployments would flag these accounts as pending rather than activate immediately.

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(role);
        user.setActive(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailOrPhoneNumber(req.getIdentifier())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), req.getPassword()));
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid credentials. Please check your email and password.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
