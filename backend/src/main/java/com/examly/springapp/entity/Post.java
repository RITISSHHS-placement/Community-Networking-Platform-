package com.examly.springapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    public enum PostType { TEXT, IMAGE, ARTICLE, POLL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "community_id", nullable = false)
    private Long communityId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_type")
    private PostType postType = PostType.TEXT;

    @Column(name = "like_count")
    private int likeCount = 0;

    @Column(name = "comment_count")
    private int commentCount = 0;

    @Column(name = "is_flagged")
    private boolean isFlagged = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Post() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public PostType getPostType() { return postType; }
    public void setPostType(PostType postType) { this.postType = postType; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }

    public boolean isFlagged() { return isFlagged; }
    public void setFlagged(boolean flagged) { isFlagged = flagged; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
