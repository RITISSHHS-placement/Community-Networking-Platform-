package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email, username, or mobile is required")
    private String identifier; // email, user ID, or mobile per FR2

    @NotBlank(message = "Password is required")
    private String password;

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
