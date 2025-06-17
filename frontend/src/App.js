import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateInputs = () => {
    // Validate Day
    if (!day) {
      setResult('Day input is required!');
      setIsSuccess(false);
      return false;
    }
    
    const dayNum = parseInt(day);
    if (isNaN(dayNum)) {
      setResult('Day input is not a number!');
      setIsSuccess(false);
      return false;
    }
    
    if (dayNum < 1 || dayNum > 31) {
      setResult('Day input is not in range (1-31)!');
      setIsSuccess(false);
      return false;
    }

    // Validate Month
    if (!month) {
      setResult('Month input is required!');
      setIsSuccess(false);
      return false;
    }
    
    const monthNum = parseInt(month);
    if (isNaN(monthNum)) {
      setResult('Month input is not a number!');
      setIsSuccess(false);
      return false;
    }
    
    if (monthNum < 1 || monthNum > 12) {
      setResult('Month input is not in range (1-12)!');
      setIsSuccess(false);
      return false;
    }

    // Validate Year
    if (!year) {
      setResult('Year input is required!');
      setIsSuccess(false);
      return false;
    }
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      setResult('Year input is not a number!');
      setIsSuccess(false);
      return false;
    }
    
    if (yearNum < 1000 || yearNum > 3000) {
      setResult('Year input is not in range (1000-3000)!');
      setIsSuccess(false);
      return false;
    }

    return true;
  };

  const handleCheck = async () => {
    setResult('');
    
    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
      try {
      const response = await axios.post('/api/date/validate', {
        day: day,
        month: month,
        year: year
      });
      
      setResult(response.data.message);
      setIsSuccess(response.data.valid);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred while validating date!');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDay('');
    setMonth('');
    setYear('');
    setResult('');
    setIsSuccess(false);
  };

  return (
    <div className="container">
      <h1>Date Time Checker</h1>
      
      <div className="input-row">
        <div className="input-group">
          <label htmlFor="day">Day (1-31):</label>
          <input
            type="text"
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="Enter day"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="month">Month (1-12):</label>
          <input
            type="text"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Enter month"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="year">Year (1000-3000):</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleCheck} 
          disabled={isLoading}
          style={{ flex: 1 }}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>
        
        <button 
          onClick={handleReset}
          style={{ 
            flex: 1, 
            backgroundColor: '#6c757d',
            ':hover': { backgroundColor: '#545b62' }
          }}
        >
          Reset
        </button>
      </div>
      
      {result && (
        <div className={`result ${isSuccess ? 'success' : 'error'}`}>
          {result}
        </div>
      )}
    </div>
  );
}

export default App;
