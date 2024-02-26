"use client"
import React, { useState } from 'react';

export default function LSDebuggerPage() {
  const [url, setUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clsResult, setClsResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clsAnalyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, isMobile })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CLS score');
      }

      const data = await response.json();
      setClsResult(data.cls);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>CLS Debugger Tool</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL here"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isMobile}
            onChange={() => setIsMobile(!isMobile)}
          /> Mobile Version
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {clsResult !== null && (
        <div>
          <strong>CLS Score:</strong> {clsResult}
        </div>
      )}
    </div>
  );
}