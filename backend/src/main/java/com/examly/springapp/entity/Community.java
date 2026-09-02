package com.examly.springapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "communities")
public class Community {

    public enum Status { ACTIVE, ARCHIVED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "manager_id", nullable = false)
    private Long managerId;

    @Column(name = "member_count")
    private int memberCount = 0;

    @Column(name = "is_private")
    private boolean isPrivate = false;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    public Community() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean aPrivate) { isPrivate = aPrivate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
