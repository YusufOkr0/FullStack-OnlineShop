package com.swe212.onlineshop.exception;

import jakarta.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;


@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private ErrorResponse buildErrorResponse(HttpStatus status, String message, HttpServletRequest request) {

        String path = request.getRequestURI();

        return ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }


    @ExceptionHandler({
            CustomerNotFoundException.class,
            ImageNotFoundException.class,
            ProductNotFoundException.class,
            OrderNotFoundException.class,
    })
    public ResponseEntity<ErrorResponse> handleCustomerNotFoundException(RuntimeException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND; // 404
        ErrorResponse errorResponse = buildErrorResponse(status, ex.getMessage(), request);
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(status).body(errorResponse);
    }


    @ExceptionHandler({
            InvalidPriceException.class,
            ImageProcessException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<ErrorResponse> handleInvalidPriceException(RuntimeException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST; // 400
        ErrorResponse errorResponse = buildErrorResponse(status, ex.getMessage(), request);
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(status).body(errorResponse);
    }


    @ExceptionHandler({
            TakenProductNameException.class,
            TakenUsernameException.class
    })
    public ResponseEntity<ErrorResponse> handleTakenProductNameException(RuntimeException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT; // 409
        ErrorResponse errorResponse = buildErrorResponse(status, ex.getMessage(), request);
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(status).body(errorResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Object> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        HttpStatus httpStatus = HttpStatus.METHOD_NOT_ALLOWED;
        ErrorResponse errorResponse = buildErrorResponse(httpStatus, ex.getMessage(), request);
        return ResponseEntity
                .status(httpStatus)
                .body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        ErrorResponse errorResponse = buildErrorResponse(httpStatus, ex.getMessage(), request);
        return ResponseEntity
                .status(httpStatus)
                .body(errorResponse);
    }

    @ExceptionHandler(NotAllowedToDeleteCustomerException.class)
    public ResponseEntity<Object> handleAccessDeniedException(NotAllowedToDeleteCustomerException ex, HttpServletRequest request) {
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        ErrorResponse errorResponse = buildErrorResponse(httpStatus, ex.getMessage(), request);
        return ResponseEntity
                .status(httpStatus)
                .body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {

        ErrorResponse errorResponse = buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.",
                request
        );
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
    }

}