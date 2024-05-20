"use client";
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import React, { ChangeEvent, useState } from "react"
import { runPage } from '@/app/lib/runPage-lcp';

const styles = {
  preformatted: 'whitespace-pre-wrap',
};


export default function DashboardDebuggersLcpPage() {


  const [url, setUrl] = useState<string>('');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debugLCP, setDebugLCP] = useState<{ lcp: number, lcpElement: string, size: string } | null>(null);

  const handleRunPage = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const VIEWPORT_SIZES = {
        'mobile': { width: 375, height: 667 },
        'desktop': { width: 1920, height: 1080 },
    };
      let viewport;
      // Define the viewport dimensions
      if (device in VIEWPORT_SIZES) {
        viewport = VIEWPORT_SIZES[device];
    }
      const debugLCP = await runPage(url, viewport);
      setDebugLCP(debugLCP); 
      console.log('debugLCP', debugLCP);
    } catch (error) {
      console.error('Failed to fetch page title:', error);
      setDebugLCP({ lcp: 0, lcpElement: `Failed to fetch element`, size: `Failed to fetch amount`});
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevice = (event: ChangeEvent<{ value: unknown }>) => {
    setDevice(event.target.value as "mobile" | "desktop");
  };

  const handleURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const lcpValue = debugLCP?.lcp;
  const elementName = debugLCP?.lcpElement;
  const count = debugLCP?.size;

  function interpretScore(lcp: number) {
    if (lcp < 2500) {
      return 'Good';
    } else if (lcp < 4000) {
      return 'Needs Improvement';
    } else if (lcp > 4000) {
      return 'Poor';
    } else {
      return 'Unknown';
    }
  }

  return (
    <>
      <section className="flex flex-col flex-1 p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-[#5d534a]">Is Your Website KWK enough?</h2>
          <div className="flex flex-col lg:flex-row items-center space-x-4">
            <form onSubmit={handleRunPage} className="flex space-x-4">
              <input
                value={url} onChange={handleURLChange}
                className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800"
                placeholder="Enter URL to test"
                type="url"
              />
                <select value={device} onChange={handleDevice} title="device" className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800">
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                </select>
                <button type="submit" className="px-4 py-2 text-white bg-[#a68b7b] rounded-md hover:bg-[#8c7364]">
                  {isLoading ? 'Loading...' : 'Debug'}
                </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between">
        <h2 className="col-span-full text-xl font-semibold text-[#5d534a]">Largest Content Paint Debugger</h2>
        </div>
        <Card className="p-4 bg-white shadow-md">
            <CardHeader className="mb-4 text-lg font-semibold">LCP Score</CardHeader>
            <CardContent className="text-[#5d534a]">
              {elementName || '___'} was the LCP element, loading at {lcpValue || '___'} ({interpretScore(lcpValue || 0 )}). It is size was {count || '___'}bytes.
              <img src={elementName} alt="LCP Element" />
            </CardContent>
        </Card>
      </section>
      </>
  )
}