package com.examly.springapp.exception;

/**
 * Thrown when a community networking record with the same unique identifier already exists.
 * HTTP Status: 409 Conflict
 */
public class DuplicateEventException extends RuntimeException {
    public DuplicateEventException(String message) {
        super(message);
    }
}
