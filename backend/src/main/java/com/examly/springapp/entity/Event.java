package com.examly.springapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    public enum TicketType { FREE, PAID }
    public enum Status { PUBLISHED, COMPLETED, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "organiser_id", nullable = false)
    private Long organiserId;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    private String location;

    private BigDecimal lat;
    private BigDecimal lng;

    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type")
    private TicketType ticketType = TicketType.FREE;

    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "rsvp_count")
    private int rsvpCount = 0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PUBLISHED;

    public Event() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getOrganiserId() { return organiserId; }
    public void setOrganiserId(Long organiserId) { this.organiserId = organiserId; }

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

    public TicketType getTicketType() { return ticketType; }
    public void setTicketType(TicketType ticketType) { this.ticketType = ticketType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getRsvpCount() { return rsvpCount; }
    public void setRsvpCount(int rsvpCount) { this.rsvpCount = rsvpCount; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
