package com.examly.springapp.repository;

import com.examly.springapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);

    default Optional<User> findByEmailOrPhoneNumber(String identifier) {
        Optional<User> byEmail = findByEmail(identifier);
        return byEmail.isPresent() ? byEmail : findByPhoneNumber(identifier);
    }
}
