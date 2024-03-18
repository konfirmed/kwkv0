"use client";
// import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import React, { ChangeEvent, useState } from "react"

interface PageSpeedInsightsResponse {
  lighthouseResult: {
    fullPageScreenshot: {
      screenshot: {
        data: string;
      }
    }
    audits: {
      metrics: {
        details: {
          items: Array<{
            largestContentfulPaint: number | any;
            cumulativeLayoutShift: number | any;
            firstContentfulPaint: number | any;
            speedIndex: number | any;
            totalBlockingTime: number | any;
            timeToFirstByte: number | any;
          }>;
        }
      }
      'resource-summary': {
        details: {
          items: Array<{
            transferSize: number | any;
          }>;
        }
      }
    }
    categories: {
      performance: {
        score: number | any;
      };
    }
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

export default function Freemium() {
  const [url, setUrl] = useState<string>('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('desktop');
  const [data, setData] = useState<PageSpeedInsightsResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState<"mobile" | "desktop">("mobile");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData(null); // Clear previous results
    setError(''); // Clear previous error
    try {
      const apiKey = process.env.NEXT_PUBLIC_CRUX_API_KEY; // Use your API key if necessary
      const insightsData = await fetchPageSpeedInsights({ url, strategy, apiKey });
      setData(insightsData);
      console.log('insightsData', insightsData)
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as "mobile" | "desktop");
  };

  const ps = data?.lighthouseResult.categories.performance.score * 100 || ''
    const lcp = data?.lighthouseResult.audits.metrics.details.items[0].largestContentfulPaint / 1000
    const cls = data?.lighthouseResult.audits.metrics.details.items[0].cumulativeLayoutShift
    const fcp = data?.lighthouseResult.audits.metrics.details.items[0].firstContentfulPaint
    const si = data?.lighthouseResult.audits.metrics.details.items[0].speedIndex
    const tbt = data?.lighthouseResult.audits.metrics.details.items[0].totalBlockingTime
    const ttfb = data?.lighthouseResult.audits.metrics.details.items[0].timeToFirstByte
    const pss = data?.lighthouseResult.fullPageScreenshot.screenshot.data
    const docSize = data?.lighthouseResult.audits['resource-summary'].details.items[0].transferSize
    const totalSize = data?.lighthouseResult.audits['resource-summary'].details.items[1].transferSize
    const cssSize = data?.lighthouseResult.audits['resource-summary'].details.items[2].transferSize
    const imgSize = data?.lighthouseResult.audits['resource-summary'].details.items[3].transferSize
    const mediaSize = data?.lighthouseResult.audits['resource-summary'].details.items[4].transferSize
    const fontSize = data?.lighthouseResult.audits['resource-summary'].details.items[6].transferSize
    const jsSize = data?.lighthouseResult.audits['resource-summary'].details.items[5].transferSize
    const otherSize = data?.lighthouseResult.audits['resource-summary'].details.items[7].transferSize
    const thirdPartySize = data?.lighthouseResult.audits['resource-summary'].details.items[8].transferSize

    const handleURLChange = (event: ChangeEvent<HTMLInputElement>) => {
      setUrl(event.target.value);
    };

    console.log("what's here", data)
  return (
    <>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">KWK</h1>
          <div className="flex space-x-4 items-center">
            <form onSubmit={handleSubmit} className="flex space-x-4">
            <input value={url} onChange={handleURLChange} className="w-[300%]" placeholder="Enter URL" />
            <select title="strategy" value={value} onChange={handleChange} >
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
            <button type="submit" className="bg-gray-300 text-gray-800 hover:bg-gray-400 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus-visible:ring-gray-500">
              Get Insights
            </button>
            </form>
          </div>
        </div>
        {/* <Tabs>
          <TabsList>
            <TabsTrigger value="real-users">Real Users</TabsTrigger>
            <TabsTrigger value="lab-data">Lab Data</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4" value="real-users">
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-1 bg-gray-200 dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">Resource Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Document</span>
                      <span>100</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Total</span>
                      <span>500</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>CSS</span>
                      <span>80</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>JavaScript</span>
                      <span>200</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Images</span>
                      <span>150</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Media</span>
                      <span>50</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Fonts</span>
                      <span>30</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Other</span>
                      <span>70</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Third Party</span>
                      <span>100</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-2 bg-gray-200 dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">Performance Metrics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Performance Score</span>
                      <span>85</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Largest Contentful Paint</span>
                      <span>2.5s</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Cumulative Layout Shift</span>
                      <span>0.1</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>First Contentful Paint</span>
                      <span>1.2s</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Speed Index</span>
                      <span>3.0s</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Total Blocking Time</span>
                      <span>0.5s</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Interaction to Next Paint</span>
                      <span>2.0s</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent className="mt-4" value="lab-data"> */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-1 bg-gray-200 dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">Resource Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Document</span>
                      <span>{docSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Total</span>
                      <span>{totalSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>CSS</span>
                      <span>{cssSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>JavaScript</span>
                      <span>{jsSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Images</span>
                      <span>{imgSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Media</span>
                      <span>{mediaSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Fonts</span>
                      <span>{fontSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Other</span>
                      <span>{otherSize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Third Party</span>
                      <span>{thirdPartySize}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-2 bg-gray-200 dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">Performance Metrics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Performance Score</span>
                      <span>{ps}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Largest Contentful Paint</span>
                      <span>{lcp}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Cumulative Layout Shift</span>
                      <span>{cls}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>First Contentful Paint</span>
                      <span>{fcp}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Speed Index</span>
                      <span>{si}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Total Blocking Time</span>
                      <span>{tbt}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 shadow-sm flex justify-between relative">
                      <span>Time To First Byte</span>
                      <span>{ttfb}</span>
                      <InfoIcon className="cursor-pointer text-gray-500 dark:text-gray-400 absolute top-0 right-0 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          {/* </TabsContent>
        </Tabs> */}
        
        <img alt="Full Page Screenshot" className="hidden" src={pss} />
      </main>
    </div>
    </>
  )
}


function InfoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="5" />
      <path d="M9 12v-4" />
      <path d="M9 6h.01" />
    </svg>
  )
}
