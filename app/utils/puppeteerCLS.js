const puppeteer = require('puppeteer');

async function analyzeCLS(url, isMobile = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (isMobile) {
    await page.setViewport({ width: 480, height: 800, isMobile: true });
  }

  await page.goto(url, { waitUntil: 'load' });

  const clsScore = await page.evaluate(() => {
    let cls = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
    return cls;
  });

  await browser.close();
  return clsScore;
}

module.exports = analyzeCLS;