package com.examly.springapp.repository;

import com.examly.springapp.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    boolean existsByTitleIgnoreCaseAndEventDate(String title, java.time.LocalDateTime eventDate);
    List<Event> findByStatus(Event.Status status);
    List<Event> findByOrganiserId(Long organiserId);
}
