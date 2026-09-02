package com.examly.springapp.service;

import com.examly.springapp.dto.EventRequest;
import com.examly.springapp.entity.Event;
import com.examly.springapp.exception.DuplicateEventException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(EventRequest req, Long organiserId) {
        // Duplicate detection on unique identifiers before record creation (FR4)
        if (eventRepository.existsByTitleIgnoreCaseAndEventDate(req.getTitle(), req.getEventDate())) {
            throw new DuplicateEventException(
                    "An event with this title and date already exists");
        }

        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setOrganiserId(organiserId);
        event.setEventDate(req.getEventDate());
        event.setLocation(req.getLocation());
        event.setLat(req.getLat());
        event.setLng(req.getLng());
        event.setCapacity(req.getCapacity());
        event.setTicketType(Event.TicketType.valueOf(req.getTicketType().toUpperCase()));
        event.setPrice(req.getPrice() == null ? BigDecimal.ZERO : req.getPrice());
        event.setStatus(Event.Status.PUBLISHED);
        return eventRepository.save(event);
    }

    public List<Event> discover() {
        return eventRepository.findByStatus(Event.Status.PUBLISHED);
    }

    public Event getById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public Event rsvp(Long id) {
        Event event = getById(id);
        event.setRsvpCount(event.getRsvpCount() + 1);
        return eventRepository.save(event);
    }

    /**
     * Haversine distance in kilometres — backs the geo-location discovery filter (FR4 / Discover page).
     */
    public static double distanceKm(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    /**
     * Bulk CSV import with field-level validation and detailed error reporting (FR4).
     * Expected header row: title,eventDate,location,lat,lng,capacity,ticketType,price
     * eventDate must be ISO-8601 (e.g. 2026-12-12T19:00:00) and in the future.
     * Each row is validated and saved independently — one bad row does not abort the batch.
     */
    public Map<String, Object> bulkImport(MultipartFile file, Long organiserId) {
        List<Map<String, Object>> errors = new ArrayList<>();
        int imported = 0;
        int rowNumber = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String header = reader.readLine();
            if (header == null) {
                errors.add(rowError(0, "File is empty"));
                return summary(0, errors);
            }

            String line;
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                if (line.isBlank()) continue;

                String[] cols = line.split(",", -1);
                if (cols.length < 8) {
                    errors.add(rowError(rowNumber,
                            "Expected 8 columns (title,eventDate,location,lat,lng,capacity,ticketType,price), got " + cols.length));
                    continue;
                }

                try {
                    String title = cols[0].trim();
                    if (title.isEmpty()) {
                        errors.add(rowError(rowNumber, "Title is required"));
                        continue;
                    }

                    LocalDateTime eventDate;
                    try {
                        eventDate = LocalDateTime.parse(cols[1].trim());
                    } catch (DateTimeParseException e) {
                        errors.add(rowError(rowNumber, "Invalid eventDate format (use ISO-8601, e.g. 2026-12-12T19:00:00)"));
                        continue;
                    }
                    if (!eventDate.isAfter(LocalDateTime.now())) {
                        errors.add(rowError(rowNumber, "Event must be future"));
                        continue;
                    }

                    int capacity;
                    try {
                        capacity = Integer.parseInt(cols[5].trim());
                        if (capacity < 1) {
                            errors.add(rowError(rowNumber, "Capacity must be at least 1"));
                            continue;
                        }
                    } catch (NumberFormatException e) {
                        errors.add(rowError(rowNumber, "Capacity must be a whole number"));
                        continue;
                    }

                    String ticketTypeRaw = cols[6].trim().toUpperCase();
                    Event.TicketType ticketType;
                    try {
                        ticketType = Event.TicketType.valueOf(ticketTypeRaw);
                    } catch (IllegalArgumentException e) {
                        errors.add(rowError(rowNumber, "ticketType must be FREE or PAID, got '" + cols[6].trim() + "'"));
                        continue;
                    }

                    BigDecimal price;
                    try {
                        price = new BigDecimal(cols[7].trim());
                        if (price.compareTo(BigDecimal.ZERO) < 0) {
                            errors.add(rowError(rowNumber, "Price must be non-negative"));
                            continue;
                        }
                    } catch (NumberFormatException e) {
                        errors.add(rowError(rowNumber, "Price must be a number"));
                        continue;
                    }

                    if (eventRepository.existsByTitleIgnoreCaseAndEventDate(title, eventDate)) {
                        errors.add(rowError(rowNumber, "Duplicate: an event with this title and date already exists"));
                        continue;
                    }

                    Event event = new Event();
                    event.setTitle(title);
                    event.setOrganiserId(organiserId);
                    event.setEventDate(eventDate);
                    event.setLocation(cols[2].trim());
                    event.setLat(parseOptionalDecimal(cols[3]));
                    event.setLng(parseOptionalDecimal(cols[4]));
                    event.setCapacity(capacity);
                    event.setTicketType(ticketType);
                    event.setPrice(price);
                    event.setStatus(Event.Status.PUBLISHED);
                    eventRepository.save(event);
                    imported++;

                } catch (Exception rowEx) {
                    errors.add(rowError(rowNumber, "Unexpected error: " + rowEx.getMessage()));
                }
            }
        } catch (IOException e) {
            errors.add(rowError(0, "Could not read file: " + e.getMessage()));
        }

        return summary(imported, errors);
    }

    private BigDecimal parseOptionalDecimal(String raw) {
        String v = raw == null ? "" : raw.trim();
        if (v.isEmpty()) return null;
        try {
            return new BigDecimal(v);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Map<String, Object> rowError(int row, String message) {
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("row", row);
        e.put("message", message);
        return e;
    }

    private Map<String, Object> summary(int imported, List<Map<String, Object>> errors) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("imported", imported);
        result.put("failedRows", errors.size());
        result.put("errors", errors);
        return result;
    }
}

