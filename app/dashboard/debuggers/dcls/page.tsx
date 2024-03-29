"use client";
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import React, { ChangeEvent, useState } from "react"
import { runPage } from '@/app/lib/runPage';
import { cls, element } from '@/app/lib/runPage';

export default function DashboardDebuggersDclsPage() {


  const [url, setUrl] = useState<string>('');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunPage = async () => {
    setIsLoading(true);
    try {
      let viewport;
      // Define the viewport dimensions
      if (device === 'mobile') {
        viewport = { width: 375, height: 667 };
      } else if (device === 'desktop') {
        viewport = { width: 1920, height: 1080 };
      }
      const title = await runPage(url, viewport);
      setPageTitle(title);
      console.log('title', title)
    } catch (error) {
      console.error('Failed to fetch page title:', error);
      setPageTitle('Failed to fetch page title');
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
  console.log('pageTitle', pageTitle)

  return (
      <section className="flex flex-col flex-1 p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-[#5d534a]">Is Your Website KWK enough?</h2>
          <div className="flex flex-col lg:flex-row items-center space-x-4">
            <form onSubmit={handleRunPage} className="flex space-x-4">
              <input
                value={url} onChange={handleURLChange}
                className="px-4 py-2 border border-gray-200 border-[#d3c1ae] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800"
                placeholder="Enter URL to test"
                type="url"
              />
              {/* <div className="flex flex-col lg:flex-row items-center space-x-2 mt-4 lg:mt-0"> */}
                <select value={device} onChange={handleDevice} title="device" className="px-4 py-2 border border-gray-200 border-[#d3c1ae] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800">
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                </select>
                <button type="submit" className="px-4 py-2 text-white bg-[#a68b7b] rounded-md hover:bg-[#8c7364]">
                  {isLoading ? 'Loading...' : 'Run Page'}
                </button>
              {/* </div> */}
            </form>
          </div>
        </div>
        <div className="flex items-center justify-between">
        <h2 className="col-span-full text-xl font-semibold text-[#5d534a]">Layout Shift Debugger</h2>
        </div>
        <Card className="p-4 bg-white shadow-md">
            <CardHeader className="mb-4 text-lg font-semibold">Layout Shift</CardHeader>
            <CardContent className="text-[#5d534a]">
              {pageTitle}
              {/* {pageTitle ? pageTitle : 'No title'} */}
              {cls}
              {element}
            </CardContent>
            <CardContent className="text-[#5d534a]">
              Measures the time taken for the largest content element in the viewport to become visible.
            </CardContent>
          </Card>
      </section>
  )
}