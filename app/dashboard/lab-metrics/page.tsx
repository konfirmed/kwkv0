"use client";
// Implement URLInput
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import SCard from '@/app/ui/scard';

// Interfaces
interface PageSpeedInsightsResponse {
  lighthouseResult: {
    fullPageScreenshot: string [] 
    audits: {
      metrics: []
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
    
    const rawps = data?.lighthouseResult?.categories.performance.score
    const ps = rawps ? Math.round(rawps * 100) : 0
    const lcp = data?.lighthouseResult.audits.metrics.details.items[0].largestContentfulPaint
    const cls = data?.lighthouseResult.audits.metrics.details.items[0].cumulativeLayoutShift
    const fcp = data?.lighthouseResult.audits.metrics.details.items[0].firstContentfulPaint
    const si = data?.lighthouseResult.audits.metrics.details.items[0].speedIndex
    const tbt = data?.lighthouseResult.audits.metrics.details.items[0].totalBlockingTime
    const ttfb = data?.lighthouseResult.audits.metrics.details.items[0].timeToFirstByte
    const pss = data?.lighthouseResult.fullPageScreenshot.screenshot.data



    return (
      <div>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Lab Metrics
      </h1>
        <form onSubmit={handleSubmit}  className="relative flex flex-1 flex-shrink-0">
            <input 
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <select className='rounded-md border' value={strategy} onChange={(e) => setStrategy(e.target.value as 'mobile' | 'desktop')}>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          <button type="submit">Get Insights</button>
        </form>
        {error && <p>Error: {error}</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
            <SCard metric='Performance Score' value={ps}/>
            <SCard metric='Largest Contentful Paint' value={lcp}/>
            <SCard metric='Cumulative Layout Shift' value={cls}/>
            <SCard metric='First Contentful Paint' value={fcp}/>
            <SCard metric='Speed Index' value={si}/>
            <SCard metric='Total Blocking Time' value= {tbt}/>
            <SCard metric='Time to First Byte' value={ttfb}/>
            {/* create card for screenshot */}
            <p>Screenshot: <img src={pss}/></p>
          </div>
      </div>
    );
  };
  
  export default PageSpeedInsightsComponent;