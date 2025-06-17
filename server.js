const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Port configuration
const PORT = 3000;

// Date validation logic
function isValidDate(day, month, year) {
    // Type validation and range checks - double check just in case
    if (typeof day !== 'number' || typeof month !== 'number' || typeof year !== 'number') {
        return false;
    }
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 3000) {
        return false;
    }
    
    // Days in each month (non-leap year)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Check for leap year
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        daysInMonth[1] = 29; // February has 29 days in leap year
    }
    
    // Check if day is valid for the given month
    return day <= daysInMonth[month - 1];
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // API endpoint for date validation
    if (pathname === '/api/date/validate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Check if we're requesting today's date validation
                const useCurrentDate = data.useCurrentDate === true;
                
                let day, month, year;
                
                if (useCurrentDate) {
                    const today = new Date();
                    day = today.getDate();
                    month = today.getMonth() + 1; // JavaScript months are 0-indexed
                    year = today.getFullYear();
                } else {
                    day = parseInt(data.day);
                    month = parseInt(data.month);
                    year = parseInt(data.year);
                }
                
                let response = {};
                
                // Validate Day
                if (isNaN(day)) {
                    response = { valid: false, message: 'Day is not a number.' };
                } else if (day < 1 || day > 31) {
                    response = { valid: false, message: 'Day is not in range [1..31].' };
                }
                // Validate Month
                else if (isNaN(month)) {
                    response = { valid: false, message: 'Month is not a number.' };
                } else if (month < 1 || month > 12) {
                    response = { valid: false, message: 'Month is not in range [1..12].' };
                }
                // Validate Year
                else if (isNaN(year)) {
                    response = { valid: false, message: 'Year is not a number.' };
                } else if (year < 1000 || year > 3000) {
                    response = { valid: false, message: 'Year is not in range [1000..3000].' };
                }
                // Check if date is valid
                else if (isValidDate(day, month, year)) {
                    response = { valid: true, message: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year).padStart(4, '0')} is a valid date time.` };
                } else {
                    response = { valid: false, message: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year).padStart(4, '0')} is an invalid date time.` };
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ valid: false, message: 'Invalid request: ' + error.message }));
            }
        });    } 
    // API endpoint to get current date
    else if (pathname === '/api/date/today' && req.method === 'GET') {
        const today = new Date();
        const currentDate = {
            day: today.getDate(),
            month: today.getMonth() + 1, // JavaScript months are 0-indexed
            year: today.getFullYear(),
            formatted: `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentDate));
    }
    // API endpoint to get relative dates (tomorrow, yesterday, etc.)
    else if (pathname === '/api/date/relative' && req.method === 'GET') {
        const query = url.parse(req.url, true).query;
        const direction = query.direction || "today"; // "yesterday", "tomorrow", "today"
        
        const today = new Date();
        let targetDate = new Date(today);
        
        // Adjust the date based on direction
        switch(direction.toLowerCase()) {
            case "yesterday":
                targetDate.setDate(today.getDate() - 1);
                break;
            case "tomorrow":
                targetDate.setDate(today.getDate() + 1);
                break;
            case "nextweek":
                targetDate.setDate(today.getDate() + 7);
                break;
            case "lastweek":
                targetDate.setDate(today.getDate() - 7);
                break;
            default:
                // Keep as today
                break;
        }
        
        const relativeDate = {
            day: targetDate.getDate(),
            month: targetDate.getMonth() + 1, // JavaScript months are 0-indexed
            year: targetDate.getFullYear(),
            formatted: `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`,
            direction: direction
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(relativeDate));
    }
    // Serve frontend files
    else if (pathname === '/' || pathname === '/index.html') {
        // Serve the frontend HTML file
        fs.readFile(path.join(__dirname, 'frontend', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading HTML file');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Default 404 response
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('- Frontend: http://localhost:${PORT}/');
    console.log('- API endpoint: http://localhost:${PORT}/api/date/validate');
});
