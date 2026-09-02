package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;

public class CommunityRequest {

    @NotBlank(message = "Community name is required")
    private String name;

    private String description;
    private boolean isPrivate;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean aPrivate) { isPrivate = aPrivate; }
}
