"use server";
import puppeteer from 'puppeteer';

// This function runs a page with Puppeteer and calculates the CLS score
export async function runPage(url: string, viewport: { width: number; height: number } | null = null): Promise<{ cls: number, element: string, cause: string, amount: string}> {
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

        const clsResult: { cls: number, element: string, cause: string, amount: string } = await page.evaluate(() => {
          return new Promise<{ cls: number, element: string, cause: string, amount: string }>((resolve, reject) => {
            let cls = 0;
            let element = '';
            let cause = '';
            let amount = '';

            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                const performanceEntry = entry as PerformanceEntry & {
                  hadRecentInput: boolean;
                  value: number;
                  sources: { node: HTMLElement, currentRect: DOMRectReadOnly, previousRect: DOMRectReadOnly }[];
                };

                if (!performanceEntry.hadRecentInput) {
                  cls += performanceEntry.value;
                  amount += performanceEntry.sources.length;
                  
                  if (performanceEntry.sources) {
                    for (const { node } of performanceEntry.sources) {
                      if (node.tagName === 'IMG' || node.tagName === 'VIDEO') {
                        element += `A shift was noticed with the following \n Tag ${node.tagName === 'IMG' ? `Image URL: ${node.getAttribute('src')}` : ''} \n`;
                      } else {
                        element += `A shift was noticed with the following:\n Tag ${node.tagName}\n ID: ${node.id}\n Class: ${node.className}.\n\n`;
                      }
                    }
                  }
                }
              }
              resolve({ cls, element, cause, amount });
            });
          observer.observe({ type: "layout-shift", buffered: true });

            setTimeout(() => {
              observer.disconnect();
              resolve({ cls, element, cause, amount });
            }, 5000);
          });
        });

        await browser.close();
        return clsResult;
    } 
    catch (error) {
        console.error('Failed to run page:', error);
        throw error; // Throw the error so it can be handled by the calling code
    }
}

export async function clsResult() {
  let clsValue;
  let elementName // Declare and initialize clsValue variable
  return (
    { clsValue,
    elementName }
  )
} 