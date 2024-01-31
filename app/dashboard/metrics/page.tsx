"use client";
import URLInput from '@/app/ui/dashboard/input';
import React, { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';

// Interfaces
interface CruxApiRequest {
  effectiveConnectionType?: string;
  formFactor?: 'DESKTOP' | 'PHONE' | 'TABLET';
  metrics: string[];
  origin?: string;
  url?: string;
  apiKey?: string;
  key?: string;
}

interface CruxApiResponse {
  // Define the response structure according to the API documentation
    record?: string[];
    metrics?: string[];
    first_input_delay: string;
    largest_contentful_paint?: string;
    cumulative_layout_shift?: string;
    first_contentful_paint?: string;
    experimental_time_to_first_byte?: string;
    interaction_to_next_paint?: string;
}

// Function to query the CrUX API
async function queryCruxApi(apiKey: string, requestData: CruxApiRequest): Promise<CruxApiResponse> {
  const url = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

const DashboardMetricsPage = () => {
    const [data, setData] = useState<CruxApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userUrl, setUserUrl] = useState<string>('');
    const [formFactor, setFormFactor] = useState<'DESKTOP' | 'PHONE' | 'TABLET'>('DESKTOP');
  
    useEffect(() => {
      if (userUrl) {
        const apiKey = process.env.NEXT_PUBLIC_CRUX_API_KEY ?? '';
        const requestData: CruxApiRequest = {
          origin: userUrl,
          formFactor: formFactor,
          metrics: ['largest_contentful_paint', 'first_input_delay', 'cumulative_layout_shift', 'first_contentful_paint', 'experimental_time_to_first_byte', 'interaction_to_next_paint']
        };
        console.log('requestdata', requestData);
  
        queryCruxApi(apiKey, requestData)
          .then(responseData => setData(responseData))
          .catch(error => setError(`Error querying CrUX API: ${error}`));
      }
    }, [userUrl, formFactor]); // Dependency array now includes userUrl
    console.log('data', data);
    const lcp = data?.record?.metrics?.largest_contentful_paint.percentiles.p75;
    const lcpp75density = data?.record?.metrics?.largest_contentful_paint.histogram[0].density;
    const fid = data?.record?.metrics?.first_input_delay.percentiles.p75;
    const fidp75density = data?.record?.metrics?.first_input_delay.histogram[0].density;
    const cls = data?.record?.metrics?.cumulative_layout_shift.percentiles.p75;
    const clsp75density = data?.record?.metrics?.cumulative_layout_shift.histogram[0].density;
    const fcp = data?.record?.metrics?.first_contentful_paint.percentiles.p75;
    const fcpp75density = data?.record?.metrics?.first_contentful_paint.histogram[0].density;
    const ttfb = data?.record?.metrics?.experimental_time_to_first_byte.percentiles.p75;
    const ttfbp75density = data?.record?.metrics?.experimental_time_to_first_byte.histogram[0].density;
    const inp = data?.record?.metrics?.interaction_to_next_paint.percentiles.p75;
    const inpp75density = data?.record?.metrics?.interaction_to_next_paint.histogram[0].density;

    const handleUrlChange = (value: string) => {
      setUserUrl(value);
    };
    const handleFormFactorChange = (formFactor: 'DESKTOP' | 'PHONE' | 'TABLET') => {
        setFormFactor(formFactor);
      };
  
    // const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();
    //   setData(null); // Reset data when a new URL is submitted
    //   setError(null); // Reset error as well
    // };
  
    return (
      <>
      <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <URLInput
          value={userUrl}
          onSubmit={handleUrlChange}
          onFormFactorChange={handleFormFactorChange}
          formFactor={formFactor}
        />
        <br />
        <h2>CrUX Metrics</h2>
        <br />
        <MCard metric='lcp' p75={lcp} />
        <MCard metric='fid' p75={fid} />
        <MCard metric='cls' p75={cls} />
        <MCard metric='fcp' p75={fcp} />
        <MCard metric='ttfb' p75={ttfb} />
        <MCard metric='inp' p75={inp} />
        <br />
        <br />
        <br />
        <p>
            Fix this soon
        </p>
        {error && <p>Error: {error}</p>}
        </div>
      </main>
        
      </>
    );
  };
  
  export default DashboardMetricsPage;
  export function MCard({
    metric,
    p75,
  }: {
    metric: string;
    p75: number | string;
  }) {
  
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{metric}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {p75}
        </p>
      </div>
    );
  }