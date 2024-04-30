// pages/api/analyze.ts

import { NextApiRequest, NextApiResponse } from 'next';

// Import the head analyzing function
import { analyzeHead } from '@/app/admin/lib/capo';

// Define the API route handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  
  try {
    const htmlContent = await fetch(url as string).then((res) => res.text());
    const { originalElements, sortedElements } = await analyzeHead(htmlContent);

    res.status(200).json({ originalElements, sortedElements });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'Head analysis failed.' });
  }
};

export default handler;