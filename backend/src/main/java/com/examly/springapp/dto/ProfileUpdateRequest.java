package com.examly.springapp.dto;

import jakarta.validation.constraints.Pattern;

public class ProfileUpdateRequest {

    @Pattern(regexp = "^[A-Za-z ]{2,100}$", message = "Name must not contain numbers or special characters")
    private String name;

    @Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits long")
    private String phoneNumber;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
