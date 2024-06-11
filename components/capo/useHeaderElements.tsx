'use client';
import { useState, useEffect } from 'react';

interface HeaderElement {
  tagName: string;
  attributes: Array<{ name: string; value: string }>;
}

interface UseHeaderElementsResult {
  originalElements: HeaderElement[],
  sortedElements: HeaderElement[],
  loading: boolean,
  error: string | null;
}

const useHeaderElements = (url: string): UseHeaderElementsResult => {
  const [originalElements, setOriginalElements] = useState<HeaderElement[]>([]);
  const [sortedElements, setSortedElements] = useState<HeaderElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeaderElements = async () => {
      if (!url) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analyze-head', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOriginalElements(data.originalElements);
        setSortedElements(data.sortedElements);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        setOriginalElements([]);
        setSortedElements([]);
      }
      setLoading(false);
    };

    fetchHeaderElements();
  }, [url]);

  return { originalElements, sortedElements, loading, error };
};

export default useHeaderElements;
