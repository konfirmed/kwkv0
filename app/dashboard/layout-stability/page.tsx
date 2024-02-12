"use client";
// Implement URLInput
import React, { useState} from 'react';


const DCLS = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/lsroute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'An error occurred while analyzing the URL.' });
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Cumulative Layout Shift (CLS) Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL"
          required
        />
        <button type="submit" disabled={loading}>Analyze</button>
      </form>

      {loading && <p>Loading...</p>}

      {result && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DCLS;
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Unified handler for our API endpoint
export async function handler(req: NextRequest): Promise<NextResponse> {
  if (req.method === 'POST') {
    try {
      // Assuming the body is already parsed or use a suitable middleware to do so
      const { url } = await req.json();
      const browser = await puppeteer.launch({
        headless: true,
      });
      const page = await browser.newPage();
      const clsResult = await analyzeCLS(page, url);

      await browser.close();
      
      // Log the CLS result for server-side visibility and return it to the client.
      console.log('CLS Result:', clsResult);
      return new NextResponse(JSON.stringify({ clsResult }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error:', error);
      // Ensure you send back a valid error message with appropriate status code.
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    // Method Not Allowed
    return new NextResponse(null, { status: 405 });
  }
}

// Function to analyze Cumulative Layout Shift
async function analyzeCLS(page: any, url: any): Promise<any> {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1440, height: 10000 });
  await page.waitForTimeout(1800);
  
  // Scroll to 75% of the page length and wait before analyzing
  await page.evaluate(() => {
    const scrollDistance = document.body.scrollHeight * 0.75;
    window.scrollTo(0, scrollDistance);
  });
  
  await page.waitForTimeout(2200);

  const clsResult = await page.evaluate(() => {
    return new Promise((resolve) => {
      let cls = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        resolve(cls); // Resolve with the CLS value
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      // Optional: Set a timeout to resolve the promise
      setTimeout(() => {
        observer.disconnect();
        resolve(cls);
      }, 5000); // 5 seconds timeout
    });
  });

  return clsResult;
}

export default handler;