package com.examly.springapp.exception;

/**
 * Thrown when a community networking name field contains non-alphabetic characters or digits.
 * HTTP Status: 400 Bad Request
 */
public class InvalidNameException extends RuntimeException {
    public InvalidNameException(String message) {
        super(message);
    }
}
