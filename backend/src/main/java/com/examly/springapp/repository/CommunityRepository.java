package com.examly.springapp.repository;

import com.examly.springapp.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    boolean existsByNameIgnoreCase(String name);
}
