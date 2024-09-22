import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';  // For styling

function App() {
  const [data, setData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get('https://advanced-rate-limiter-v2-amd64.onrender.com/dashboard', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhc2ljIiwibGljZW5zZSI6ImJhc2ljIiwiaWF0IjoxNzI2OTcyODQxLCJleHAiOjE3MjcwMDE2NDF9.dHGPzKy7rHIOQmPgFSVxCBG6xIjghv31ELj-PLffwL0',
          'accept': 'application/json'
        }
      });

      const filteredData = response.data.filter(item => item.key !== "country");
      const countryItem = response.data.find(item => item.key === "country");

      setData(filteredData);  // Update the data state
      setCountryData(countryItem);  // Update the country-specific data state
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);  // Stop loading spinner
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <h1>Rate Limit Data</h1>

      {/* First Table: Excludes items with key === "country" */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>IP</th>
            <th>Requests Left</th>
            <th>Location</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            item.key !== "country" && (
              <tr key={item.key}>
                <td>{item.key}</td>
                <td>{item.ip}</td>
                <td>{item.requestsLeft}</td>
                <td>{item.location}</td>
                <td>{item.userName || 'N/A'}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      {/* Second Table: Renders only the "country" data */}
      {countryData && (
        <div>
          <h2>Country Load Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Load</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop over the country data */}
              {Object.entries(countryData)
                .filter(([key, value]) => key !== 'key')  // Exclude the "key" field itself
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{value.country}</td>
                    <td>{value.load}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
