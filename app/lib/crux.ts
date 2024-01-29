"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_KEY = 'AIzaSyAq65RK7KmmxehbTiDH5lxhtnT9dEh23os'; // Add Security

async function fetchCrUXMetrics(url: string) {
    const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}&origin=${encodeURIComponent(url)}`;
  
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching CrUX report:', error);
      throw error;
    }
  };
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { url } = req.body;

    try {
      const data = await fetchCrUXMetrics(url);
      res.status(200).json(data);
    } catch (error: any) { // Consider handling specific error types more gracefully
      console.error('Server-side error fetching CrUX report:', error);
      res.status(500).json({ errorMessage: 'Failed to fetch the report.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}