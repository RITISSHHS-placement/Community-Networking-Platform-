package com.examly.springapp.exception;

/**
 * Thrown when a phone number is not exactly 10 consecutive digits.
 * HTTP Status: 400 Bad Request
 */
public class InvalidPhoneException extends RuntimeException {
    public InvalidPhoneException(String message) {
        super(message);
    }
}
