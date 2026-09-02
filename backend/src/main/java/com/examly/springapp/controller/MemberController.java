package com.examly.springapp.controller;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.ProfileUpdateRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class MemberController {

    private static final Logger log = LoggerFactory.getLogger(MemberController.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    public MemberController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/api/members/register")
    public ResponseEntity<AuthResponse> registerMember(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @GetMapping("/api/members/{id}")
    public ResponseEntity<Map<String, Object>> getMember(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return ResponseEntity.ok(toProfile(user));
    }

    @GetMapping("/api/users/profile")
    public ResponseEntity<Map<String, Object>> profile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(toProfile(user));
    }

    /**
     * Post-registration profile updates (FR1: "Profile management allows post-registration
     * updates with complete audit trail"). Only name and phone number are editable here;
     * email/password changes are intentionally excluded pending a re-verification flow.
     */
    @PutMapping("/api/users/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest req, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StringBuilder changes = new StringBuilder();
        if (req.getName() != null && !req.getName().equals(user.getName())) {
            changes.append("name: '").append(user.getName()).append("' -> '").append(req.getName()).append("'; ");
            user.setName(req.getName());
        }
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().equals(user.getPhoneNumber())) {
            changes.append("phoneNumber updated; ");
            user.setPhoneNumber(req.getPhoneNumber());
        }
        userRepository.save(user);

        // Audit trail: every profile modification logged with user identity and timestamp (FR1).
        // A persistent, queryable audit_log table is the natural next step for production;
        // this gives an immediate, real trail without introducing a new table in this pass.
        log.info("PROFILE_UPDATE user_id={} email={} changes=[{}]", user.getId(), user.getEmail(),
                changes.length() > 0 ? changes.toString() : "no-op");

        return ResponseEntity.ok(toProfile(user));
    }

    private Map<String, Object> toProfile(User user) {
        return Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phoneNumber", user.getPhoneNumber(),
                "role", user.getRole().name(),
                "createdDate", user.getCreatedDate()
        );
    }
}

