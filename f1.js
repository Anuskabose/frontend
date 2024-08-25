import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setFilters([]);

    try {
      // Validate JSON input
      JSON.parse(input);

      // Make API call
      const res = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: input,
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message === 'Unexpected token' ? 'Invalid JSON format' : err.message);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => 
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const getFilteredResponse = () => {
    if (!response) return null;
    
    const filteredResponse = {};
    if (filters.includes('Alphabets') && response.alphabets) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (filters.includes('Numbers') && response.numbers) {
      filteredResponse.numbers = response.numbers;
    }
    if (filters.includes('Highest lowercase alphabet') && response.highestLowercase) {
      filteredResponse.highestLowercase = response.highestLowercase;
    }
    
    return filteredResponse;
  };

  return (
    <div className="App">
      <h1>API Input</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-section">
          <h2>Multi Filter</h2>
          <select multiple value={filters} onChange={handleFilterChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          <h2>Filtered Response</h2>
          <pre>{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;