package com.example.datetimechecker.dto;

public class DateResponse {
    private boolean valid;
    private String message;
    
    public DateResponse() {}
    
    public DateResponse(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
    }
    
    // Getters and Setters
    public boolean isValid() {
        return valid;
    }
    
    public void setValid(boolean valid) {
        this.valid = valid;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
