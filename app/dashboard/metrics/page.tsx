"use client";
import URLInput from '@/app/ui/dashboard/input';
import React, { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import MCard from '@/app/ui/mcard';

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
  record: {
    metrics: {
      largest_contentful_paint: {
        percentiles: {
          p75: string;
        }
      };
      first_input_delay: {
        percentiles: {
          p75: string;
        }
      };
      cumulative_layout_shift: {
        percentiles: {
          p75: string;
        }
      };
      first_contentful_paint: {
        percentiles: {
          p75: string;
        }
      };
      experimental_time_to_first_byte: {
        percentiles: {
          p75: string;
        }
      };
      interaction_to_next_paint: {
        percentiles: {
          p75: string;
        }
      };
    };
  };
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
    const records = data?.record;
    
    const lcp = records?.metrics.largest_contentful_paint.percentiles.p75;
    const fid = data?.record?.metrics?.first_input_delay.percentiles.p75;
    const cls = data?.record?.metrics?.cumulative_layout_shift.percentiles.p75;
    const fcp = data?.record?.metrics?.first_contentful_paint.percentiles.p75;
    const ttfb = data?.record?.metrics?.experimental_time_to_first_byte.percentiles.p75;
    const inp = data?.record?.metrics?.interaction_to_next_paint.percentiles.p75;

    const handleUrlChange = (value: string) => {
      setUserUrl(value);
    };
    const handleFormFactorChange = (formFactor: 'DESKTOP' | 'PHONE' | 'TABLET') => {
        setFormFactor(formFactor);
      };

  
    return (
      <>
      <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        RUM Metrics
      </h1>
      <URLInput
          value={userUrl}
          onSubmit={handleUrlChange}
          onFormFactorChange={handleFormFactorChange}
          formFactor={formFactor}
          strategy={'desktop'}
        />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <MCard metric='Largest Contentful Paint (CrUX)' p75={lcp} />
        <MCard metric='First Input Delay (CrUX)' p75={fid} />
        <MCard metric='Cumulative Layout Shift (CrUX)' p75={cls} />
        <MCard metric='First Contentful Paint (CrUX)' p75={fcp} />
        <MCard metric='Time To First Byte (CrUX)' p75={ttfb} />
        <MCard metric='Interaction To Next Paint (CrUX)' p75={inp} />
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
  