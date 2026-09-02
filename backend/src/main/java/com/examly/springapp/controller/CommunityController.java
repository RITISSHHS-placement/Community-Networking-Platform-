package com.examly.springapp.controller;

import com.examly.springapp.dto.CommunityRequest;
import com.examly.springapp.entity.Community;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;
    private final UserRepository userRepository;

    public CommunityController(CommunityService communityService, UserRepository userRepository) {
        this.communityService = communityService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Community> create(@Valid @RequestBody CommunityRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(communityService.create(req, principalId(auth)));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<Community>> discover() {
        return ResponseEntity.ok(communityService.discover());
    }

    @PutMapping("/{id}/join")
    public ResponseEntity<Community> join(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.join(id));
    }

    private Long principalId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
