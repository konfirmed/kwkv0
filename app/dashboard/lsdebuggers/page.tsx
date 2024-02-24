// Always use "use client" for components that should only render in the client side in Next.js
"use client"
// Import React and the useState hook for managing component state
import React, { useState } from 'react';

// Define an interface for the expected response from our API call
interface ClsApiResponse {
  cls?: number; // The CLS score, optional because an error might be returned instead
  error?: string; // An error message, optional because a successful response will not have this
}

// Define our component as a React Functional Component
const ClsChecker: React.FC = () => {
  // State for storing the URL entered by the user
  const [url, setUrl] = useState<string>('');
  // State for storing whether the analysis should be for mobile or desktop
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // State for storing the CLS score returned from the API
  const [clsScore, setClsScore] = useState<number | null>(null);
  // State for storing any error message returned from the API or caught during fetching
  const [error, setError] = useState<string | null>(null);

  // Function to call our API and fetch the CLS score
  const fetchCLS = async (url: string, isMobile: boolean): Promise<void> => {
    try {
      // Perform the fetch request to our API endpoint `/api/cls`
      const response = await fetch('/api/cls', {
        method: 'POST', // Specify the method as POST since our API expects a POST request
        headers: {
          'Content-Type': 'application/json', // Set the content type so our API knows the format of the body
        },
        body: JSON.stringify({ url, isMobile }), // Convert the payload to a string to send in the request
      });

      // Check if the response was not successful (i.e., not in the range of 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok'); // Throw an error to be caught by our catch block
      }

      // Parse the JSON body of the response to get our data
      const data: ClsApiResponse = await response.json();

      // If the API returned an error message, throw it as an error
      if (data.error) {
        throw new Error(data.error);
      }

      // If all went well, update our state with the fetched CLS score, or null if not present
      setClsScore(data.cls ?? null);
      // Also, clear any existing error message as this request was successful
      setError(null);
    } catch (err) {
      // Catch any errors that were thrown during the try block
      if (err instanceof Error) {
        // If it's an error object, set our error state to its message
        setError(err.message);
      } else {
        // If the caught thing isn't an Error object, something went very wrong
        setError('An unexpected error occurred');
      }
      // Since an error occurred, clear any previous CLS score from state
      setClsScore(null);
    }
  };

  // Function to handle the form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior, which reloads the page
    e.preventDefault();
    // Call our `fetchCLS` function with the current state values
    fetchCLS(url, isMobile);
  };

  // The rendered component
  return (
    <div>
      {/* Form for submitting a URL for CLS analysis */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="urlInput">URL:</label>
        <input
          id="urlInput"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <label htmlFor="deviceTypeSelect">Device Type:</label>
        <select 
          id="deviceTypeSelect"
          value={isMobile ? 'mobile' : 'desktop'} 
          onChange={(e) => setIsMobile(e.target.value === 'mobile')}
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <button type="submit">Analyze</button>
      </form>
      {/* Conditionally render an error message if we have one */}
      {error && <p>Error: {error}</p>}
      {/* Conditionally render the CLS score if we have one */}
      {clsScore !== null && <p>CLS Score: {clsScore}</p>}
    </div>
  );
};

// Export our component so it can be used in other parts of our application
export default ClsChecker;