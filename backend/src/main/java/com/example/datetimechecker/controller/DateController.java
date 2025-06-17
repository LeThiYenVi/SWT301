package com.example.datetimechecker.controller;

import com.example.datetimechecker.dto.DateRequest;
import com.example.datetimechecker.dto.DateResponse;
import com.example.datetimechecker.service.DateValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/date")
@CrossOrigin(origins = "http://localhost:3000")
public class DateController {

    @Autowired
    private DateValidationService dateValidationService;

    @PostMapping("/validate")
    public DateResponse validateDate(@RequestBody DateRequest request) {
        return dateValidationService.validateDate(request);
    }

    @GetMapping("/today")
    public Map<String, Object> getCurrentDate() {
        LocalDate today = LocalDate.now();
        Map<String, Object> response = new HashMap<>();

        // Extract day, month and year
        response.put("day", today.getDayOfMonth());
        response.put("month", today.getMonthValue());
        response.put("year", today.getYear());
        response.put("formatted",
                String.format("%02d/%02d/%04d", today.getDayOfMonth(), today.getMonthValue(), today.getYear()));

        return response;
    }
}
