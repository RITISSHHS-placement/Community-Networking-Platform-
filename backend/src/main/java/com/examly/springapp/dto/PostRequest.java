package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PostRequest {

    @NotNull(message = "Community ID is required")
    private Long communityId;

    @NotBlank(message = "Content is required")
    private String content;

    private String postType = "TEXT"; // TEXT | IMAGE | ARTICLE | POLL

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }
}
