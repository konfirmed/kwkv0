// In runPage.ts
"use server";
import puppeteer from 'puppeteer';

export async function runPage(url: string, viewport: { width: number; height: number } | null = null): Promise<string> {
  try {
    const browser = await puppeteer.launch(
      headless: "true",
    );
    const page = await browser.newPage();
    // Set the viewport if provided
    if (viewport) {
      await page.setViewport(viewport);
    }
    await page.goto(url, { waitUntil: 'networkidle0' });
    // get html content of page
    const html = await page.content();
    console.log('Page content', html);
    const pageTitle = await page.title();
    await browser.close();
    return pageTitle;
  } catch (error) {
    console.error('Error fetching page title:', error);
    throw error;
  }
}
