interface CruxApiRequest {
  effectiveConnectionType?: string;
  formFactor?: 'DESKTOP' | 'PHONE' | 'TABLET';
  metrics: string[];
  origin?: string;
  url?: string;
  apiKey?: string;
  key?: string;
}

interface CruxApiResponse {
  // Define the response structure according to the API documentation
    record?: string[];
    metrics?: string[];
    first_input_delay: string;
    largest_contentful_paint?: string;
    cumulative_layout_shift?: string;
    first_contentful_paint?: string;
    experimental_time_to_first_byte?: string;
    interaction_to_next_paint?: string;
}

async function queryCruxApi(apiKey: string, requestData: CruxApiRequest): Promise<CruxApiResponse> {
    const url = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      return await response.json() as CruxApiResponse;
    } catch (error) {
      // Optional: Implement retry logic or more sophisticated error handling here
      throw error;
    }
  }
  
  export { queryCruxApi };