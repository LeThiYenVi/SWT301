import java.io.*;
import java.net.*;
import java.util.*;
import com.sun.net.httpserver.*;

// Simplified standalone server to validate date
public class RunBackend {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", 8080), 0);

        // Handle CORS preflight requests
        server.createContext("/api/date/validate", exchange -> {
            // Set CORS headers for all responses
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");

            // Handle OPTIONS preflight request
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1); // No content
                exchange.close();
                return;
            }

            // Handle POST request for date validation
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                try {
                    // Read the request body
                    StringBuilder requestBody = new StringBuilder();
                    try (BufferedReader reader = new BufferedReader(
                            new InputStreamReader(exchange.getRequestBody()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            requestBody.append(line);
                        }
                    }

                    // Extract day, month, year from JSON
                    String json = requestBody.toString();
                    String day = extractValue(json, "day");
                    String month = extractValue(json, "month");
                    String year = extractValue(json, "year");

                    // Validate the date
                    Map<String, Object> responseMap = validateDate(day, month, year);

                    // Send response
                    String response = "{\"valid\":" + responseMap.get("valid") + ",\"message\":\""
                            + responseMap.get("message") + "\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                } catch (Exception e) {
                    String errorResponse = "{\"valid\":false,\"message\":\"Error processing request: " + e.getMessage()
                            + "\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(500, errorResponse.getBytes().length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                }
            } else {
                // Method not allowed
                exchange.sendResponseHeaders(405, -1);
            }
            exchange.close();
        });

        server.start();
        System.out.println("Server started on port 8080");
    }

    // Simple JSON parsing method (for lightweight implementation)
    private static String extractValue(String json, String key) {
        String keyPattern = "\"" + key + "\":";
        int start = json.indexOf(keyPattern);
        if (start == -1) {
            return "";
        }
        start += keyPattern.length();

        // Skip whitespace
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) {
            start++;
        }

        // Check if value is a string or number
        boolean isString = false;
        if (json.charAt(start) == '"') {
            isString = true;
            start++;
        }

        int end = start;
        if (isString) {
            while (end < json.length() && json.charAt(end) != '"') {
                end++;
            }
        } else {
            while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.')) {
                end++;
            }
        }

        return json.substring(start, end);
    }

    // Date validation logic
    private static Map<String, Object> validateDate(String dayStr, String monthStr, String yearStr) {
        Map<String, Object> result = new HashMap<>();

        // Validate Day
        try {
            int day = Integer.parseInt(dayStr);
            if (day < 1 || day > 31) {
                result.put("valid", false);
                result.put("message", "Day is not in range [1..31].");
                return result;
            }
        } catch (NumberFormatException e) {
            result.put("valid", false);
            result.put("message", "Day is not a number.");
            return result;
        }

        // Validate Month
        try {
            int month = Integer.parseInt(monthStr);
            if (month < 1 || month > 12) {
                result.put("valid", false);
                result.put("message", "Month is not in range [1..12].");
                return result;
            }
        } catch (NumberFormatException e) {
            result.put("valid", false);
            result.put("message", "Month is not a number.");
            return result;
        }

        // Validate Year
        try {
            int year = Integer.parseInt(yearStr);
            if (year < 1000 || year > 3000) {
                result.put("valid", false);
                result.put("message", "Year is not in range [1000..3000].");
                return result;
            }
        } catch (NumberFormatException e) {
            result.put("valid", false);
            result.put("message", "Year is not a number.");
            return result;
        }

        // All inputs are valid numbers in range, now check if the date is valid
        int day = Integer.parseInt(dayStr);
        int month = Integer.parseInt(monthStr);
        int year = Integer.parseInt(yearStr);

        if (isValidDate(day, month, year)) {
            result.put("valid", true);
            result.put("message", String.format("%02d/%02d/%04d is a valid date time.", day, month, year));
        } else {
            result.put("valid", false);
            result.put("message", String.format("%02d/%02d/%04d is an invalid date time.", day, month, year));
        }

        return result;
    }

    private static boolean isValidDate(int day, int month, int year) {
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

    private static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
}
