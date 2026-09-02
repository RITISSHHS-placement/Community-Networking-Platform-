package com.examly.springapp.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Event date is required")
    @Future(message = "Event must be future")
    private LocalDateTime eventDate;

    private String location;
    private BigDecimal lat;
    private BigDecimal lng;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Ticket type is required")
    private String ticketType; // FREE | PAID

    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    private BigDecimal price = BigDecimal.ZERO;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getLat() { return lat; }
    public void setLat(BigDecimal lat) { this.lat = lat; }

    public BigDecimal getLng() { return lng; }
    public void setLng(BigDecimal lng) { this.lng = lng; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
