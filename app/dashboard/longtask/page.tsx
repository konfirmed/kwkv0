"use client";
import React, { useState, useEffect, useRef } from 'react';
import URLInput from '@/app/ui/dashboard/urlinput';

interface LongTaskEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  containerType: string;
}



const LongTaskPageComponent: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [longTasks, setLongTasks] = useState<LongTaskEntry[]>([]);
  const [error, setError] = useState<string>('');
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEntryList;
      const filteredEntries = entries
        .filter((entry) => entry.entryType === 'longtask')
        .map((entry) => {
          const containerType = identifyContainerType(entry);
          return {
            name: entry.name,
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
            containerType,
          };
        });

      setLongTasks((prevLongTasks) => [...prevLongTasks, ...filteredEntries]);
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  }, []);

  const identifyContainerType = (entry: PerformanceEntry): string => {
    if (entry.name.includes('.js')) {
      return 'script';
    } else if (entry.name.includes('.jpg') || entry.name.includes('.png')) {
      return 'image';
    } else {
      return 'unknown';
    }
  };

  const handleIntersection = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((intersectionEntry) => {
          console.log('Element causing long task:', intersectionEntry.target);
        });
      },
      {
        root: null,
        threshold: 0.5, 
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
  };

  const handleSubmit = async () => {
    setLongTasks([]);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Simulated asynchronous operation completed'); 
      handleIntersection();
    } catch (error) {
      console.error('Error performing the operation:', error);
      setError('Error performing the operation.');
    }
  };

  return (
    <div>
      <h2>Long Task Analysis</h2>
      <URLInput
        value={url}
        onSubmit={(enteredURL) => setUrl(enteredURL)}
        onFormFactorChange={(formFactor) => console.log('Form Factor:', formFactor)}
        onNetworkTypeChange={(networkType) => console.log('Network Type:', networkType)}
        formFactor="DESKTOP"
        // networkType="4g"
        placeholder="Enter URL"
      />
      {error && <p>Error: {error}</p>}
      <ul>
        {longTasks.map((task, index) => (
          <li key={index}>
            <p>Name: {task.name}</p>
            <p>Entry Type: {task.entryType}</p>
            <p>Start Time: {task.startTime}</p>
            <p>Duration: {task.duration}</p>
            <p>Container Type: {task.containerType}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LongTaskPageComponent;
