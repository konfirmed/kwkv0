// Import the Puppeteer library to control headless Chrome or Chromium
const puppeteer = require('puppeteer');

// Define an asynchronous API route handler for Next.js
export default async function handler(req, res) {
  // Check if the incoming request is a POST request
  if (req.method === 'POST') {
    // Destructure url and isMobile values from the request body
    const { url, isMobile } = req.body;

    try {
      // Call the asynchronous function to get the CLS score
      const cls = await getCLS(url, isMobile);
      // Respond with a 200 status code and the CLS score in JSON format
      res.status(200).json({ cls });
    } catch (error) {
      // Log any errors to the console
      console.error(error);
      // Respond with a 500 status code and an error message in JSON format
      res.status(500).json({ error: 'Failed to retrieve CLS' });
    }
  } else {
    // If the request is not a POST request, set the Allow header to only allow POST
    res.setHeader('Allow', ['POST']);
    // Respond with a 405 status code and an error message indicating the method is not allowed
    res.status(405).end('Method ' + req.method + ' Not Allowed');
  }
}

// Asynchronous function to calculate the CLS score of a webpage
async function getCLS(url, isMobile) {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  // Open a new page in the browser
  const page = await browser.newPage();

  // Check if the isMobile flag is true and set the viewport size accordingly
  if (isMobile) {
    const mobileViewport = { width: 480, height: 800, isMobile: true };
    await page.setViewport(mobileViewport);
  }

  // Navigate to the given URL and wait until the page loads
  await page.goto(url, { waitUntil: 'load' });

  // Evaluate JavaScript in the context of the page to calculate the CLS score
  const clsScore = await page.evaluate(() => {
    // Return a promise that resolves with the CLS score
    return new Promise((resolve) => {
      let cls = 0; // Variable to accumulate the CLS score
      // Create a new PerformanceObserver to observe layout shift entries
      new PerformanceObserver((list) => {
        // Get all observed entries
        const entries = list.getEntries();
        // Iterate through the entries
        for (const entry of entries) {
          // Check if the layout shift entry does not have recent user input
          if ('hadRecentInput' in entry && 'value' in entry && !entry.hadRecentInput) {
            // Accumulate the layout shift score
            cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
      
      // Add an event listener for when the page becomes hidden (e.g., tab change or close)
      // This is a heuristic to 'finish' collecting CLS
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Resolve the promise with the accumulated CLS score
          resolve(cls);
        }
      });
    });
  });

  // Close the browser instance
  await browser.close();
  // Return the calculated CLS score
  return clsScore;
}