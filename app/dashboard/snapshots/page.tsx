"use client";
// In your React component file
import React, { useState } from 'react';
import { runPage } from '@/app/lib/runPage';

const DashboardDebuggersDclsPage = () => {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunPage = async () => {
    setIsLoading(true);
    try {
      // Define the viewport dimensions
      const viewport = { width: 1280, height: 720 };
      const title = await runPage('https://example.com', viewport);
      setPageTitle(title);
    } catch (error) {
      console.error('Failed to fetch page title:', error);
      setPageTitle('Failed to fetch page title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Run Page</h1>
      <button onClick={handleRunPage} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Run Page'}
      </button>
      <p>{pageTitle}</p>
    </div>
  );
};

export default DashboardDebuggersDclsPage;