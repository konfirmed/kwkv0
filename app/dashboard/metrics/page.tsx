"use client";
import URLInput from '@/app/ui/dashboard/input';
import React, { useState, useEffect } from 'react';
import { Card } from '@/app/ui/dashboard/cards';
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

 
export default async function Page() {
 
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
  
    return (
      <>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Metrics
      </h1>
      <URLInput
          value={userUrl}
          onSubmit={handleUrlChange}
          onFormFactorChange={handleFormFactorChange}
          formFactor={formFactor}
        />
        <br />
        <br />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <Card title="LCP" value={`${lcp}`} type="collected" />
        <Card title="Synthetic Metrics" value={''} type="pending" />
        <Card title="Layout Shift Debugger" value={''} type="invoices" />
        <Card
          title="Long Tasks Debugger"
          value={""}
          type="customers"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <Card title="Speculation Rules" value={''} type="collected" />
        <Card title="Largest Contentful Paint" value={''} type="pending" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pt-3">
        <Card title="Actual Head" value={''} type="collected" />
        <Card title="Sorted Head" value={''} type="pending" />
      </div>
      <div className="grid gap-6 pt-3">
        <Card title="SEO Analyzer" value={''} type="invoices" />
        <Card
          title="Waterfall"
          value={""}
          type="customers"
        />
      </div>
        <p>LCP: {lcp}</p>
        <p>LCP p75 density: {lcpp75density}</p>
        <p>FID: {fid}</p>
        <p>FID p75 density: {fidp75density}</p>
        <p>CLS: {cls}</p>
        <p>CLS p75 density: {clsp75density}</p>
        <p>FCP: {fcp}</p>
        <p>FCP p75 density: {fcpp75density}</p>
        <p>TTFB: {ttfb}</p>
        <p>TTFB p75 density: {ttfbp75density}</p>
        <p>INP: {inp}</p>
        <p>INP p75 density: {inpp75density}</p>
        <br />
        <p>
            Fix this soon
        </p>
        {error && <p>Error: {error}</p>}
        
      </>
    );
  }