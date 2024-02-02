"use server"
// lib/puppeteer.ts
import puppeteer from 'puppeteer';

// Function to fetch long tasks using Puppeteer
export const fetchLongTasksWithPuppeteer = async (url: string): Promise<{ duration: number; startTime: number }[]> => {
  let browser;

  try {
    // Launch a headless browser
    browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });

    // Evaluate page to capture long tasks
    const longTasksWithElements = await page.evaluate(() => {
      return new Promise<{ duration: number; startTime: number }[]>((resolve) => {
        const observedLongTasks: { duration: number; startTime: number }[] = [];
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const longTask = {
              duration: entry.duration,
              startTime: entry.startTime,
            };
            observedLongTasks.push(longTask);
          });
        });

        // Observe "longtask" entries
        observer.observe({ type: 'longtask', buffered: true });

        // Wait for 11 seconds to capture long tasks
        setTimeout(() => {
          observer.disconnect();
          resolve(observedLongTasks);
        }, 11000);
      });
    });

    return longTasksWithElements;
  } catch (error) {
    console.error('Error using Puppeteer:', error);
    throw new Error('Failed to fetch long tasks using Puppeteer.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
