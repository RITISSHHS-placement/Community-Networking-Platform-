package com.examly.springapp.repository;

import com.examly.springapp.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId);
    List<Post> findAllByOrderByCreatedAtDesc();
}
