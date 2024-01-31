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