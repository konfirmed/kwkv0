// api/apply-speculation-rules.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { applySpeculationRules } from '../lib/specRule';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url, rules, viewport } = req.body;

    // Validate input
    if (!url || !rules) {
      return res.status(400).json({ error: 'URL and rules are required' });
    }

    try {
      await applySpeculationRules(url, rules, viewport);
      res.status(200).json({ message: 'Speculation rules applied successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
