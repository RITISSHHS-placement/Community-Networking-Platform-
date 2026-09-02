package com.examly.springapp.service;

import com.examly.springapp.dto.PostRequest;
import com.examly.springapp.entity.Post;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post create(PostRequest req, Long authorId) {
        Post post = new Post();
        post.setAuthorId(authorId);
        post.setCommunityId(req.getCommunityId());
        post.setContent(req.getContent());
        post.setPostType(Post.PostType.valueOf(req.getPostType().toUpperCase()));
        return postRepository.save(post);
    }

    public List<Post> feed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public Post like(Long id) {
        Post post = getById(id);
        post.setLikeCount(post.getLikeCount() + 1);
        return postRepository.save(post);
    }

    public Post report(Long id) {
        Post post = getById(id);
        post.setFlagged(true);
        return postRepository.save(post);
    }

    public Post moderate(Long id, boolean flagged) {
        Post post = getById(id);
        post.setFlagged(flagged);
        return postRepository.save(post);
    }
}
