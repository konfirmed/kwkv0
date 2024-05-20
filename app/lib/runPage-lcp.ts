"use server";
import puppeteer from 'puppeteer';

// This function runs a page with Puppeteer and calculates the LCP score
export async function runPage(url: string, viewport: { width: number; height: number } | null = null): Promise<{ lcp: number, lcpElement: string, size: string}> {
    try {
        const browser = await puppeteer.launch({
          headless: true,
        });
        const page = await browser.newPage();
        if (viewport) {
          await page.setViewport(viewport);
        }

        // Navigate to the page
        // await page.goto(url, { waitUntil: 'networkidle2' });
        await page.goto(url, { waitUntil: 'networkidle0' });
        // await page.goto(url, { waitUntil: 'load' });

        await page.evaluate(() => {
          const scrollDistance = document.body.scrollHeight * 0.5;
          window.scrollTo(0, scrollDistance);
        });

        // page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);

        const lcpResult: { lcp: number, lcpElement: string, size: string } = await page.evaluate(() => {
          return new Promise<{ lcp: number, lcpElement: string, size: string }>((resolve, reject) => {
            let lcp = 0;
            let lcpElement = '';
            // let cause = '';
            let size = '';

            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1]; // Use the latest LCP candidate
              lcp = lastEntry.startTime;
              size = lastEntry.size;
              lcpElement = lastEntry.url;
              // cause = lastEntry.element[0].element
              
            });
            observer.observe({ type: "largest-contentful-paint", buffered: true });

            setTimeout(() => {
              observer.disconnect();
              resolve({ lcp, lcpElement, size });
            }, 5000);
          });
        });

        await browser.close();
        return lcpResult;
    } 
    catch (error) {
        console.error('Failed to run page:', error);
        throw error; // Throw the error so it can be handled by the calling code
    }
}

export async function lcpResult() {
  let lcpValue;
  let elementName // Declare and initialize clsValue variable
  return (
    { lcpValue,
    elementName }
  )
} 