package com.examly.springapp.exception;

/**
 * Thrown when a community networking record cannot be found by the provided ID.
 * HTTP Status: 404 Not Found
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
