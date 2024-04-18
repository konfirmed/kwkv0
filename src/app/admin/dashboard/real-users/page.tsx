"use client";
import React, { useState, useEffect } from 'react';
import URLInput from '@/app/ui/dashboard/input'; // Assuming this is a custom component
import MCard from '@/app/ui/dashboard/mcard'; // Assuming this is a custom component
// Assuming lusitana is correctly imported and used
import { lusitana } from '@/app/ui/fonts';

interface MetricPercentiles {
  p75: string;
}

interface MetricRecord {
  largest_contentful_paint: MetricPercentiles;
  cumulative_layout_shift: MetricPercentiles;
  first_contentful_paint: MetricPercentiles;
  experimental_time_to_first_byte: MetricPercentiles;
  interaction_to_next_paint: MetricPercentiles;
  p75: string;
}

// Adjusted to reflect a possible structure based on your usage
interface CruxApiResponse {
  record: {
    metrics: {
      [key: string]: MetricRecord;
    };
  };
}

interface CruxApiRequest {
  effectiveConnectionType?: string;
  formFactor?: 'DESKTOP' | 'PHONE' | 'TABLET';
  origin?: string;
  url?: string;
  apiKey?: string;
  key?: string;
  metrics: Array<'largest_contentful_paint' | 'cumulative_layout_shift' | 'first_contentful_paint' | 'experimental_time_to_first_byte' | 'interaction_to_next_paint'>;
}

async function queryCruxApi(apiKey: string, requestData: CruxApiRequest): Promise<CruxApiResponse> {
  const url = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
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
        formFactor,
        metrics: ['largest_contentful_paint', 'cumulative_layout_shift', 'first_contentful_paint', 'experimental_time_to_first_byte', 'interaction_to_next_paint'],
      };

      queryCruxApi(apiKey, requestData)
        .then((responseData) => setData(responseData))
        .catch((error) => setError(`Error querying CrUX API: ${error}`));
    }
  }, [userUrl, formFactor]);

  // Define metric variables here, assuming data structure is fixed
  const metrics = data?.record.metrics;
  const lcp = metrics?.largest_contentful_paint.p75;
  const cls = metrics?.cumulative_layout_shift.p75;
  const fcp = metrics?.first_contentful_paint.p75;
  const ttfb = metrics?.experimental_time_to_first_byte.p75;
  const inp = metrics?.interaction_to_next_paint.p75;

  // Handler functions
  const handleUrlChange = (value: string) => {
    setUserUrl(value);
  };

  const handleFormFactorChange = (value: 'DESKTOP' | 'PHONE' | 'TABLET') => {
    setFormFactor(value);
  };

  return (
    <>
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>RUM Metrics</h1>
        <URLInput
          value={userUrl}
          onSubmit={handleUrlChange}
          onFormFactorChange={handleFormFactorChange}
          formFactor={formFactor}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
          {lcp && <MCard metric="Largest Contentful Paint (CrUX)" p75={lcp} />}
          {fcp && <MCard metric="First Contentful Paint (CrUX)" p75={fcp} />}
          {cls && <MCard metric="Cumulative Layout Shift (CrUX)" p75={cls} />}
          {ttfb && <MCard metric="Time To First Byte (CrUX)" p75={ttfb} />}
          {inp && <MCard metric="Interaction To Next Paint (CrUX)" p75={inp} />}
        </div>
        {error && <p>Error: {error}</p>}
      </main>
    </>
  );
};

export default DashboardMetricsPage;
