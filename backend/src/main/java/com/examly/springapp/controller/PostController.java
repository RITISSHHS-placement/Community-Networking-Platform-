package com.examly.springapp.controller;

import com.examly.springapp.dto.PostRequest;
import com.examly.springapp.entity.Post;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    public PostController(PostService postService, UserRepository userRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
    }

    @PostMapping("/api/posts")
    public ResponseEntity<Post> create(@Valid @RequestBody PostRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(req, principalId(auth)));
    }

    @GetMapping("/api/feed")
    public ResponseEntity<List<Post>> feed() {
        return ResponseEntity.ok(postService.feed());
    }

    @PutMapping("/api/posts/{id}/like")
    public ResponseEntity<Post> like(@PathVariable Long id) {
        return ResponseEntity.ok(postService.like(id));
    }

    @PostMapping("/api/posts/{id}/report")
    public ResponseEntity<Post> report(@PathVariable Long id) {
        return ResponseEntity.ok(postService.report(id));
    }

    @PutMapping("/api/posts/{id}/moderate")
    public ResponseEntity<Post> moderate(@PathVariable Long id, @RequestParam boolean flagged) {
        return ResponseEntity.ok(postService.moderate(id, flagged));
    }

    private Long principalId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
