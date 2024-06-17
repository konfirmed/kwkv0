import puppeteer from 'puppeteer';

/**
 * Get Event/Navigation Timing metrics from a given URL using Puppeteer.
 * 
 * @param url - The URL to analyze.
 */
export async function getEventNavigationTiming(url: string): Promise<object> {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Change to false if you need to debug visually
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ],
    });
    const page = await browser.newPage();

    // Set extra HTTP headers to mimic a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Listen for network request failures to debug issues
    page.on('requestfailed', request => {
      console.log('Request failed:', request.url(), request.failure()?.errorText);
    });

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
