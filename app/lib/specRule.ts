import puppeteer from 'puppeteer';

export async function applySpeculationRules(url: string, speculationRules: object, viewport: { width: number; height: number } | null = null): Promise<void> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    if (viewport) {
      await page.setViewport(viewport);
    }

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Inject speculation rules into the page
    await page.evaluate((rules) => {
      const script = document.createElement('script');
      script.type = 'speculationrules';
      script.textContent = JSON.stringify(rules);
      document.head.appendChild(script);
    }, speculationRules);

    // Close the browser after applying the rules
    await browser.close();
  } catch (error) {
    console.error('Failed to apply speculation rules:', error);
    throw error; // Throw the error so it can be handled by the calling code
  }
}