import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const browser = await puppeteer.launch({
        headless: true, // Use true for headless mode
        // Alternatively, you can use "shell" or omit the headless option for default behavior
        // headless: false, // Use false for non-headless (full) mode
        // headless: undefined, // Omit for default behavior (usually headless unless devtools are enabled)
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.setViewport({
        width: 1440,
        height: 10000,
      });

      // Wait for x seconds after the page loads
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Scroll to 75% of the page length
      await page.evaluate(() => {
        const scrollDistance = document.body.scrollHeight * 0.70;
        window.scrollTo(0, scrollDistance);
      });

      await new Promise(resolve => setTimeout(resolve, 2200));

      // Inject CLS tracking script here (or any other analysis you want to perform)

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Count layout shifts without recent user input only
          if (!entry.hadRecentInput) {
            console.log("LayoutShift value:", entry.value);
            if (entry.sources) {
              for (const { node, currentRect, previousRect } of entry.sources)
                console.log("LayoutShift source:", node, {
                  currentRect,
                  previousRect,
                });
            }
          }
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });

      const clsResult = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            // Rest of the code...
          });

          let cls: any; // Declare the 'cls' variable with type 'any'

          // Optional: Set a timeout to resolve the promise if no entries are detected within a certain time frame
          setTimeout(() => {
            observer.disconnect();
            resolve(cls);
          }, 5000); // 5 seconds timeout for example

          observer.observe({ type: 'layout-shift', buffered: true });
        });
      });

      await browser.close();

      res.status(200).json({ clsResult });
      console.log('clsResult', clsResult);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

