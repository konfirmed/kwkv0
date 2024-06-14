'use client';
import React, { useState } from 'react';

const EventNavigationTimingForm = () => {
  const [url, setURL] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMetrics(null); // Clear previous metrics
    setMessage('');

    setIsLoading(true);
    try {
      const response = await fetch('/api/event-nav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Get Event/Navigation Timing Metrics</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setURL(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Loading...' : 'Get Metrics'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
      {metrics && (
        <pre style={{ marginTop: '20px', maxHeight: '300px', overflowY: 'scroll' }}>
          {JSON.stringify(metrics, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default EventNavigationTimingForm;