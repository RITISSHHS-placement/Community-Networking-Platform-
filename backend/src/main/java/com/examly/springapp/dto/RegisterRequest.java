package com.examly.springapp.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]{2,100}$", message = "Name must not contain numbers or special characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits long")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
        message = "Password must meet security requirements"
    )
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // GUEST | MEMBER | MODERATOR | EVENT_ORGANISER | COMMUNITY_MANAGER

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
