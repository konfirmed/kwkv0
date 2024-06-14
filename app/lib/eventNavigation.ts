import puppeteer from 'puppeteer';

/**
 * Get Event/Navigation Timing metrics from a given URL using Puppeteer.
 * 
 * @param url - The URL to analyze.
 */
export async function getEventNavigationTiming(url: string): Promise<object> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set both navigation and general page timeout
    await page.setDefaultNavigationTimeout(60000); // 60 seconds
    page.setDefaultTimeout(60000); // 60 seconds

    // Navigate to the page with custom waitUntil conditions
    await page.goto(url, { 
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'], // Custom combination
      timeout: 60000, // 60 seconds
    });

    // Extract Event/Navigation Timing metrics
    const metrics = await page.evaluate(() => {
      const navigationTiming = window.performance.getEntriesByType('navigation')[0];
      const eventTiming = window.performance.getEntriesByType('event');
      return { navigationTiming, eventTiming };
    });

    // Close the browser
    await browser.close();

    return metrics;
  } catch (error) {
    console.error('Failed to get Event/Navigation Timing metrics:', error);
    throw error;
  }
}