"use server";
import puppeteer from 'puppeteer';

export async function runPage(url: string, viewport: { width: number; height: number } | null = null): Promise<string> {
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

        const clsResult = await page.evaluate(() => {
          return new Promise((resolve, reject) => {
            let cls = 0;
            let element = '';

            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  cls += entry.value;
                  if (entry.sources) {
                    for (const { node, currentRect, previousRect } of entry.sources) {
                      console.log("LayoutShift source:", node, {
                        currentRect,
                        previousRect,
                      });
                      element = node;
                    }
                  }
                }
              }
              resolve({ cls, element });
            });

            observer.observe({ type: "layout-shift", buffered: true });

            setTimeout(() => {
              observer.disconnect();
              resolve(cls);
            }, 5000);
          });
        });

        console.log('clsResult', clsResult);

        await browser.close();
        return clsResult;
    } catch (error) {
        console.error('Failed to run page:', error);
        throw error; // Throw the error so it can be handled by the calling code
    }
}
