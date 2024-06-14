'use server'
import puppeteer from 'puppeteer';

export async function runPage(
  url: string, 
  viewport: { width: number; height: number } | null = null
): Promise<{ cls: number, element: string, cause: string, amount: string }> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    if (viewport) {
      await page.setViewport(viewport);
    }

    // Set both navigation and general page timeout
    await page.setDefaultNavigationTimeout(60000); // 60 seconds
    page.setDefaultTimeout(60000); // 60 seconds

    // Navigate to the page with custom waitUntil conditions
    await page.goto(url, { 
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'], // Custom combination
      timeout: 60000, // 60 seconds
    });

    // Scroll the page
    await page.evaluate(() => {
      const scrollDistance = document.body.scrollHeight * 0.5;
      window.scrollTo(0, scrollDistance);
    });

    const clsResult: { cls: number, element: string, cause: string, amount: string } = await page.evaluate(() => {
      return new Promise<{ cls: number, element: string, cause: string, amount: string }>((resolve) => {
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

              for (const { node } of performanceEntry.sources) {
                if (node.tagName === 'IMG' || node.tagName === 'VIDEO') {
                  element += `A shift was noticed with the following \n Tag ${node.tagName === 'IMG' ? `Image URL: ${node.getAttribute('src')}` : ''} \n`;
                } else {
                  element += `A shift was noticed with the following:\n Tag ${node.tagName}\n ID: ${node.id}\n Class: ${node.className}.\n\n`;
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
  } catch (error) {
    console.error('Failed to run page:', error);
    throw error;
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