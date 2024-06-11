// components/ApplySpeculationRulesForm.tsx
'use client'
import React, { useState } from 'react';

const ApplySpeculationRulesForm = () => {
  const [url, setURL] = useState('');
  const [rules, setRules] = useState('');
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      const parsedRules = JSON.parse(rules); // Validate JSON rules

      setIsLoading(true);
      const response = await fetch('/api/apply-speculation-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, rules: parsedRules, viewport }),
      });

      setIsLoading(false);

      if (response.ok) {
        setMessage('Speculation rules applied successfully.');
        // Clear form fields after successful submission
        setURL('');
        setRules('');
        setViewport({ width: 0, height: 0 });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const validateJSON = (input: string) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Apply Speculation Rules</h2>
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rules">Speculation Rules (JSON):</label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '150px' }}
          />
          {!validateJSON(rules) && rules && (
            <p style={{ color: 'red' }}>Invalid JSON format</p>
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="viewport">Viewport (optional):</label>
          <input
            type="number"
            placeholder="Width"
            value={viewport.width}
            onChange={(e) => setViewport({ ...viewport, width: Number(e.target.value) })}
            style={{ marginRight: '10px', padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Height"
            value={viewport.height}
            onChange={(e) => setViewport({ ...viewport, height: Number(e.target.value) })}
            style={{ padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !validateJSON(rules)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Applying...' : 'Apply Rules'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default ApplySpeculationRulesForm;
