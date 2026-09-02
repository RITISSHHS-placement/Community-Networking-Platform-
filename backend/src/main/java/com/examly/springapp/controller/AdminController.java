package com.examly.springapp.controller;

import com.examly.springapp.entity.User;
import com.examly.springapp.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * All routes here are already restricted to ROLE_ADMIN by SecurityConfig
 * (.requestMatchers("/api/admin/**").hasRole("ADMIN")) — this controller is what
 * was missing behind that rule.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> setUserStatus(@PathVariable Long id, @RequestParam boolean active,
                                               Authentication authentication) {
        return ResponseEntity.ok(adminService.setUserActive(id, active, authentication.getName()));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable Long id, @RequestParam String role,
                                                Authentication authentication) {
        return ResponseEntity.ok(adminService.changeUserRole(id, role, authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(adminService.platformStats());
    }
}
