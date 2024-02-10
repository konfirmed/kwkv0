import React, { useState, useEffect } from 'react';

interface CLSAnalyzerProps {
  url: string;
}

const CLSAnalyzer: React.FC<CLSAnalyzerProps> = ({ url }) => {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Change the error state type to string

  useEffect(() => {
    const analyzeCLS = async () => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ls', { // Ensure the endpoint path is correct
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data.clsResult);
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching the CLS data.');
      }

      setLoading(false);
    };

    analyzeCLS();
  }, [url]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {result !== null && (
        <div>
          <h4>Results</h4>
          <p>Cumulative Layout Shift Score: {result}</p>
        </div>
      )}
    </div>
  );
};

export default CLSAnalyzer;
