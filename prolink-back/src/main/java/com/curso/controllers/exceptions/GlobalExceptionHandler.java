package com.curso.controllers.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> duplicateException(DataIntegrityViolationException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getCause().getCause().getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> entityIdNotFoundException(RuntimeException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}



