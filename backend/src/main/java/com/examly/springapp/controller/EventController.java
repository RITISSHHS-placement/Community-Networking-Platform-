package com.examly.springapp.controller;

import com.examly.springapp.dto.EventRequest;
import com.examly.springapp.entity.Event;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Event> create(@Valid @RequestBody EventRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(req, principalId(auth)));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<Event>> discover() {
        return ResponseEntity.ok(eventService.discover());
    }

    @PutMapping("/{id}/rsvp")
    public ResponseEntity<Event> rsvp(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.rsvp(id));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> analytics(@PathVariable Long id) {
        Event event = eventService.getById(id);
        double capacityUsed = event.getCapacity() == 0 ? 0
                : (event.getRsvpCount() * 100.0) / event.getCapacity();
        return ResponseEntity.ok(Map.of(
                "eventId", event.getId(),
                "rsvpCount", event.getRsvpCount(),
                "capacity", event.getCapacity(),
                "capacityUsedPercent", Math.round(capacityUsed * 10.0) / 10.0,
                "status", event.getStatus().name()
        ));
    }

    /**
     * Bulk CSV import (FR4). Expects a multipart file with header row:
     * title,eventDate,location,lat,lng,capacity,ticketType,price
     * Every row is validated and reported independently — a bad row doesn't abort the batch.
     */
    @PostMapping(value = "/bulk-import", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> bulkImport(@RequestParam("file") MultipartFile file,
                                                            Authentication auth) {
        return ResponseEntity.ok(eventService.bulkImport(file, principalId(auth)));
    }

    private Long principalId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}

