"use client";
import URLInput from '@/app/ui/dashboard/input';
import React, { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';

// Interfaces
interface PageSpeedInsightsResponse {
  lighthouseResult: {
    fullPageScreenshot: string [] 
    audits: {
      metrics: string [] | number
    }
    categories: {
      performance: {
        score: number;
      };
    };
  };
}

interface FetchPageSpeedInsightsParams {
  url: string;
  strategy: 'mobile' | 'desktop';
  apiKey?: string;
}

  async function fetchPageSpeedInsights({
    url,
    strategy,
    apiKey = '',
  }: FetchPageSpeedInsightsParams): Promise<PageSpeedInsightsResponse> {
    const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  
  const PageSpeedInsightsComponent: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('desktop');
    const [data, setData] = useState<PageSpeedInsightsResponse | null>(null);
    const [error, setError] = useState<string>('');
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setData(null); // Clear previous results
      setError(''); // Clear previous error
      try {
        const apiKey = process.env.NEXT_PUBLIC_CRUX_API_KEY; // Use your API key if necessary
        const insightsData = await fetchPageSpeedInsights({ url, strategy, apiKey });
        setData(insightsData);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };
    console.log('data', data);
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            URL:
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
          <label>
            Strategy:
            <select value={strategy} onChange={(e) => setStrategy(e.target.value as 'mobile' | 'desktop')}>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </label>
          <button type="submit">Get Insights</button>
        </form>
        {error && <p>Error: {error}</p>}
        {data && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
            {/* <h3>Results:</h3> */}
            <SCard metric='Performance Score' value={data.lighthouseResult.categories.performance.score * 100}/>
            <SCard metric='Largest Contentful Paint' value={data.lighthouseResult.audits.metrics.details.items[0].largestContentfulPaint}/>
            <SCard metric='Cumulative Layout Shift' value={data.lighthouseResult.audits.metrics.details.items[0].cumulativeLayoutShift}/>
            <SCard metric='First Contentful Paint' value={data.lighthouseResult.audits.metrics.details.items[0].firstContentfulPaint}/>
            <SCard metric='Speed Index' value={data.lighthouseResult.audits.metrics.details.items[0].speedIndex}/>
            <SCard metric='Total Blocking Time' value= {data.lighthouseResult.audits.metrics.details.items[0].totalBlockingTime}/>
            <SCard metric='Time to First Byte' value={data.lighthouseResult.audits.metrics.details.items[0].timeToFirstByte}/>
            <p>Screenshot: <img src={`${data.lighthouseResult.fullPageScreenshot.screenshot.data}`}/></p>

          </div>
        )}
      </div>
    );
  };
  
  export default PageSpeedInsightsComponent;

  export function SCard({
    metric,
    value,
  }: {
    metric: string;
    value: number | string;
  }) {
  
    return (
      <div className="mt-5 rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{metric}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {value}
        </p>
      </div>
    );
  }