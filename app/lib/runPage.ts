"use server";
import puppeteer from 'puppeteer';

export async function runPage(url: string, viewport: { width: number; height: number } | null = null): Promise<{ cls: number, element: string}> {
    try {
        const browser = await puppeteer.launch({
          headless: true,
        });
        const page = await browser.newPage();
        if (viewport) {
          await page.setViewport(viewport);
        }
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.evaluate(() => {
          const scrollDistance = document.body.scrollHeight * 0.70;
          window.scrollTo(0, scrollDistance);
        });

        const clsResult: { cls: number, element: string } = await page.evaluate(() => {
          return new Promise<{ cls: number, element: string }>((resolve, reject) => {
            let cls = 0;
            let element = '';

            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                const performanceEntry = entry as PerformanceEntry & {
                  hadRecentInput: boolean;
                  value: number;
                  sources: { node: string, currentRect: string, previousRect: string }[];
                };

                if (!performanceEntry.hadRecentInput) {
                  cls += performanceEntry.value;
                  if (performanceEntry.sources) {
                    for (const { node, currentRect, previousRect } of performanceEntry.sources) {
                      console.log("LayoutShift source:", node, {
                        currentRect,
                        previousRect,
                      });
                      element += `${node} shifted from ${previousRect} to ${currentRect}\n by ${performanceEntry.value} because of ${performanceEntry.sources}.\n`;
                    }
                  }
                }
              }
              resolve({ cls, element });
            });
          observer.observe({ type: "layout-shift", buffered: true });

            setTimeout(() => {
              observer.disconnect();
              resolve({ cls, element });
            }, 5000);
          });
        });

        await browser.close();
        return clsResult;
    } catch (error) {
        console.error('Failed to run page:', error);
        throw error; // Throw the error so it can be handled by the calling code
    }
}

export async function clsResult() {
    return (
        { clsValue,
        elementName }
    )
} 