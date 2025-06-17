package com.example.datetimechecker.service;

import com.example.datetimechecker.dto.DateRequest;
import com.example.datetimechecker.dto.DateResponse;
import org.springframework.stereotype.Service;

@Service
public class DateValidationService {

    public DateResponse validateDate(DateRequest request) {
        // Validate Day
        DateResponse dayValidation = validateDay(request.getDay());
        if (!dayValidation.isValid()) {
            return dayValidation;
        }

        // Validate Month
        DateResponse monthValidation = validateMonth(request.getMonth());
        if (!monthValidation.isValid()) {
            return monthValidation;
        }

        // Validate Year
        DateResponse yearValidation = validateYear(request.getYear());
        if (!yearValidation.isValid()) {
            return yearValidation;
        }

        // All inputs are valid numbers in range, now check if the date is valid
        int day = Integer.parseInt(request.getDay());
        int month = Integer.parseInt(request.getMonth());
        int year = Integer.parseInt(request.getYear());

        if (isValidDate(day, month, year)) {
            return new DateResponse(true, String.format("%02d/%02d/%04d is a valid date time.", day, month, year));
        } else {
            return new DateResponse(false, String.format("%02d/%02d/%04d is an invalid date time.", day, month, year));
        }
    }

    private DateResponse validateDay(String dayStr) {
        try {
            int day = Integer.parseInt(dayStr);
            if (day < 1 || day > 31) {
                return new DateResponse(false, "Day is not in range [1..31].");
            }
            return new DateResponse(true, "Day is valid");
        } catch (NumberFormatException e) {
            return new DateResponse(false, "Day is not a number.");
        }
    }

    private DateResponse validateMonth(String monthStr) {
        try {
            int month = Integer.parseInt(monthStr);
            if (month < 1 || month > 12) {
                return new DateResponse(false, "Month is not in range [1..12].");
            }
            return new DateResponse(true, "Month is valid");
        } catch (NumberFormatException e) {
            return new DateResponse(false, "Month is not a number.");
        }
    }

    private DateResponse validateYear(String yearStr) {
        try {
            int year = Integer.parseInt(yearStr);
            if (year < 1000 || year > 3000) {
                return new DateResponse(false, "Year is not in range [1000..3000].");
            }
            return new DateResponse(true, "Year is valid");
        } catch (NumberFormatException e) {
            return new DateResponse(false, "Year is not a number.");
        }
    }

    private boolean isValidDate(int day, int month, int year) {
        // Check if month is between 1 and 12
        if (month < 1 || month > 12) {
            return false;
        }

        // Days in each month (non-leap year)
        int[] daysInMonth = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

        // Check for leap year
        if (isLeapYear(year)) {
            daysInMonth[1] = 29; // February has 29 days in leap year
        }

        // Check if day is valid for the given month
        return day > 0 && day <= daysInMonth[month - 1];
    }

    private boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
}
