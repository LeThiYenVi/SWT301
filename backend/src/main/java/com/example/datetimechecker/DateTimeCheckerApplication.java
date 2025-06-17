package com.example.datetimechecker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:3000")
public class DateTimeCheckerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DateTimeCheckerApplication.class, args);
    }
}
