"use client";
import { CardHeader, CardContent, Card } from "@/components/ui/card"
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
  }
  loadingExperience: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: number | any;
      CUMULATIVE_LAYOUT_SHIFT_SCORE: number | any;
      INTERACTION_TO_NEXT_PAINT: number | any;
    }
  }
};

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


export function LH() {


  const [url, setUrl] = useState<string>('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [data, setData] = useState<PageSpeedInsightsResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


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
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setStrategy(event.target.value as "mobile" | "desktop");
  };

  const ps = data?.lighthouseResult.categories.performance.score * 100 || '0'
  const lcp = data?.lighthouseResult.audits.metrics.details.items[0].largestContentfulPaint / 1000 || '0 s'
  const cls = data?.lighthouseResult.audits.metrics.details.items[0].cumulativeLayoutShift || '0'
  const fcp = data?.lighthouseResult.audits.metrics.details.items[0].firstContentfulPaint / 1000 || '0 s'
  const si = data?.lighthouseResult.audits.metrics.details.items[0].speedIndex / 1000 || '0 s'
  const tbt = data?.lighthouseResult.audits.metrics.details.items[0].totalBlockingTime / 1000 || '0 s'
  const ttfb = data?.lighthouseResult.audits.metrics.details.items[0].timeToFirstByte / 1000 || '0 s'
  const pss = data?.lighthouseResult.fullPageScreenshot.screenshot.data || ''
  const docSize = data?.lighthouseResult.audits['resource-summary'].details.items[0].transferSize || '0'
  const totalSize = data?.lighthouseResult.audits['resource-summary'].details.items[1].transferSize || '0'
  const cssSize = data?.lighthouseResult.audits['resource-summary'].details.items[2].transferSize || '0'
  const imgSize = data?.lighthouseResult.audits['resource-summary'].details.items[3].transferSize || '0'
  const mediaSize = data?.lighthouseResult.audits['resource-summary'].details.items[4].transferSize || '0'
  const fontSize = data?.lighthouseResult.audits['resource-summary'].details.items[6].transferSize || '0'
  const jsSize = data?.lighthouseResult.audits['resource-summary'].details.items[5].transferSize || '0'
  const otherSize = data?.lighthouseResult.audits['resource-summary'].details.items[7].transferSize || '0'
  const thirdPartySize = data?.lighthouseResult.audits['resource-summary'].details.items[8].transferSize || '0'
  const cruxlcp = data?.loadingExperience.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || '0'
  const cruxcls = data?.loadingExperience.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile / 100 || '0'
  const cruxinp = data?.loadingExperience.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile || '0'

  const handleURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  return (
    <main key="1" className="flex flex-col h-screen">

      <section className="flex flex-col flex-1 p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-[#5d534a]">Is Your Website KWK enough?</h2>
          <div className="flex flex-col lg:flex-row items-center space-x-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                value={url} onChange={handleURLChange}
                className="px-4 py-2 borderborder-[#d3c1ae] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800"
                placeholder="Enter URL to test"
                type="url"
              />
              {/* <div className="flex flex-col lg:flex-row items-center space-x-2 mt-4 lg:mt-0"> */}
                <select value={strategy} onChange={handleChange} title="strategy" className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68b7b] dark:border-gray-800">
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                </select>
                <button type="submit" className="px-4 py-2 text-white bg-[#a68b7b] rounded-md hover:bg-[#8c7364]">
                  {isLoading ? 'Loading...' : 'Run Test'}
                </button>
              {/* </div> */}
            </form>
          </div>
        </div>
        <div className="flex justify-center items-center my-6">
          <div className="w-full max-w-4xl p-4 bg-white shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-[#5d534a]">Page Load Screenshot</h3>
            <img
              alt="Page Load Screenshot"
              className="w-full h-auto"
              height="400"
              src={pss}
              style={{
                aspectRatio: "800/400",
                objectFit: "cover",
              }}
              width="800"
            />
          </div>
        </div>
        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TimeseriesChart className="w-full aspect-[4/3]" />
          <StackedbarChart className="w-full aspect-[4/3]" />
          <TimeseriesChart className="w-full aspect-[4/3]" />
        </div> */}
        <div className="flex items-center justify-between">
        <h2 className="col-span-full text-xl font-semibold text-[#5d534a]">CrUX Real User Metrics</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4 bg-white shadow-md">
            <CardHeader className="mb-4 text-lg font-semibold">Largest Contentful Paint</CardHeader>
            <CardContent className="text-[#5d534a]">
              {cruxlcp} ms
            </CardContent>
            <CardContent className="text-[#5d534a]">
              Measures the time taken for the largest content element in the viewport to become visible.
            </CardContent>
          </Card>
          <Card className="p-4 bg-white shadow-md">
            <CardHeader className="mb-4 text-lg font-semibold">Interaction to Next Paint</CardHeader>
            <CardContent className="text-[#5d534a]">
              {cruxinp} ms
            </CardContent>
            <CardContent className="text-[#5d534a]">
              Evaluates the responsiveness of a page by measuring the time from user interaction to the next paint.
            </CardContent>
          </Card>
          <Card className="p-4 bg-white shadow-md">
            <CardHeader className="mb-4 text-lg font-semibold">Cumulative Layout Shift</CardHeader>
            <CardContent className="text-[#5d534a]">
              {cruxcls}
            </CardContent>
            <CardContent className="text-[#5d534a]">
              Quantifies how often users experience unexpected layout shifts during the lifespan of the page.
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-[#5d534a]">Resource Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Document</h3>
              <p className="text-[#5d534a]">{docSize} </p>
              <img
                alt="Document icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of HTML documents in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Total</h3>
              <p className="text-[#5d534a]">{totalSize}</p>
              <img
                alt="Total icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Total size of all resources.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">CSS</h3>
              <p className="text-[#5d534a]">{cssSize}</p>
              <img
                alt="CSS icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of CSS files in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">JavaScript</h3>
              <p className="text-[#5d534a]">{jsSize}</p>
              <img
                alt="JavaScript icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of JavaScript files in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Images</h3>
              <p className="text-[#5d534a]">{imgSize}</p>
              <img
                alt="Images icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of image files in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Media</h3>
              <p className="text-[#5d534a]">{mediaSize}</p>
              <img
                alt="Media icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of media files (audio and video) in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Fonts</h3>
              <p className="text-[#5d534a]">{fontSize}</p>
              <img
                alt="Fonts icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of font files in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Other</h3>
              <p className="text-[#5d534a]">{otherSize}</p>
              <img
                alt="Other icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of other types of files in bytes.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Third Party</h3>
              <p className="text-[#5d534a]">{thirdPartySize}</p>
              <img
                alt="Third Party icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                The size of third-party files in bytes.
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-[#5d534a]">Performance Metrics Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Performance Score</h3>
              <p className="text-[#5d534a]">{ps}</p>
              <img
                alt="Performance Score icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Overall performance score.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Largest Contentful Paint</h3>
              <p className="text-[#5d534a]">{lcp}</p>
              <img
                alt="Largest Contentful Paint icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Time taken for the largest content element to be painted.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Cumulative Layout Shift</h3>
              <p className="text-[#5d534a]">{cls}</p>
              <img
                alt="Cumulative Layout Shift icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Total sum of all individual layout shift scores.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">First Contentful Paint</h3>
              <p className="text-[#5d534a]">{fcp}</p>
              <img
                alt="First Contentful Paint icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Time taken for the first content element to be painted.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Speed Index</h3>
              <p className="text-[#5d534a]">{si}</p>
              <img
                alt="Speed Index icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                How quickly the contents of a page are visibly populated.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Total Blocking Time</h3>
              <p className="text-[#5d534a]">{tbt}</p>
              <img
                alt="Total Blocking Time icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Total amount of time that a page is blocked from responding to user input.
              </div>
            </div>
            <div className="p-4 bg-white shadow-md relative group">
              <h3 className="mb-2 text-lg font-semibold">Time To First Byte</h3>
              <p className="text-[#5d534a]">{ttfb}</p>
              <img
                alt="Time To First Byte icon"
                className="absolute top-2 right-2"
                height="100"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 text-sm text-white bg-[#3e3427] opacity-0 group-hover:opacity-100">
                Time it takes for the browser to receive the first byte of page content.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
