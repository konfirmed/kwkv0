'use client'
import React, { useState } from 'react';

const ApplySpeculationRulesForm = () => {
  const [url, setURL] = useState('');
  const [rules, setRules] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      const response = await fetch('/api/apply-speculation-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, rules: JSON.parse(rules) }),
      });

      if (response.ok) {
        setMessage('Speculation rules applied successfully.');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Apply Speculation Rules</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setURL(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="rules">Speculation Rules (JSON):</label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            required
          />
        </div>
        <button type="submit">Apply Rules</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ApplySpeculationRulesForm;