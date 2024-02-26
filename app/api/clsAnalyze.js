const puppeteer = require('puppeteer');
const analyzeCLS = require('../../utils/puppeteerCLS');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { url, isMobile } = req.body;

  try {
    const cls = await analyzeCLS(url, isMobile);
    res.status(200).json({ cls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve CLS' });
  }
}