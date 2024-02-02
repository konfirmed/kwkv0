"use client";
// app/dashboard/longtask/page.tsx
import React, { useState, useEffect } from 'react';
import { fetchLongTasksWithPuppeteer } from '@/app/api/longtask/route';

interface LongTaskEntry {
  duration: number;
  startTime: number;
}

const LongTaskPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [formFactor, setFormFactor] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  const [longTasks, setLongTasks] = useState<LongTaskEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormFactorChange = (selectedFormFactor: 'DESKTOP' | 'MOBILE') => {
    setFormFactor(selectedFormFactor);
  };

  const handleGetLongTasks = async () => {
    setLoading(true);
    console.log(`Fetching long tasks for ${url} on ${formFactor}...`);
    try {
      const tasks = await fetchLongTasksWithPuppeteer(url);
      setLongTasks(tasks);
    } catch (error) {
      console.error('Error fetching long tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Function to fetch long tasks using Puppeteer
    const fetchLongTasks = async () => {
      setLoading(true);
      console.log('Fetching long tasks using Puppeteer...');
      try {
        const tasks = await fetchLongTasksWithPuppeteer(url);
        setLongTasks(tasks);
      } catch (error) {
        console.error('Error fetching long tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetching long tasks when the URL is set
    if (url) {
      fetchLongTasks();
    }
  }, [url, formFactor]);

  return (
    <div>
    <h3>Long Task Analysis</h3>
    <label>
      URL:
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
    </label>
    <br />
    <label>
      Form Factor:
      <select value={formFactor} onChange={(e) => handleFormFactorChange(e.target.value as 'DESKTOP' | 'MOBILE')}>
        <option value="DESKTOP">Desktop</option>
        <option value="MOBILE">Mobile</option>
      </select>
    </label>
    <br />
    <button onClick={handleGetLongTasks} disabled={loading}>
      {loading ? 'Loading...' : 'Get Long Tasks'}
    </button>
    <div>
      {loading && <p>Loading long tasks...</p>}
      {!loading && longTasks.length > 0 && (
        <div>
          <h4>Long Tasks Detected</h4>
          <ul>
          {longTasks.map((task: { startTime: number; duration: number }, index: number) => (
  <li key={index}>
    Task at {task.startTime.toFixed(2)}ms for {task.duration.toFixed(2)}ms
  </li>
))}
          </ul>
        </div>
      )}
      {!loading && longTasks.length === 0 && <p>No long tasks detected.</p>}
    </div>
  </div>
);
};

export default LongTaskPage;

