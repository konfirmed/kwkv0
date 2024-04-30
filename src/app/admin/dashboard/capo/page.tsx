/* eslint-disable max-len */
'use client';
import React from 'react';
import Head from 'next/head';

import DebugHeaderItem from '@/app/components/debug-header-item';

const Page: React.FC = () => {
  const [state, setState] = React.useState({
    url: '',
    originalElements: [] as { tagName: string; attributes: { name: string; value: string }[] }[],
    headElements: [] as { tagName: string; attributes: { name: string; value: string }[] }[],
    isLoading: false,
    isValidUrl: true,
  });

  const validateUrl = (url: string): boolean => {
    const pattern = new RegExp(/^https?:\/\//i);
    return pattern.test(url);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, url: event.target.value });
  };

  const handleUrlValidation = (): void => {
    setState({ ...state, isValidUrl: validateUrl(state.url) });
  };

  const analyzeHeadElements = async (): Promise<void> => {
    const { isValidUrl, url } = state;

    if (!isValidUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    setState(s => ({ ...s, isLoading: true }));

    try {
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      const { originalElements, sortedElements } = await response.json();

      setState(s => ({ ...s, originalElements, headElements: sortedElements, isLoading: false }));
    } catch (error) {
      console.error('Error during analysis:', error);
      setState(s => ({ ...s, originalElements: [], headElements: [], isLoading: false }));
    }
  };

  const { url, originalElements, headElements, isLoading, isValidUrl } = state;

  return (
    <>
      <Head>
        <title>Debug - Head</title>
        <meta name="description" content="Learn more about Knfrmd Web Corp..." />
      </Head>
      <div>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          onBlur={handleUrlValidation}
          placeholder="Enter URL"
        />
        <button onClick={analyzeHeadElements} disabled={!isValidUrl || isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Head'}
        </button>
        {isLoading && <div>Loading...</div>}
        {originalElements.length > 0 && (
          <div>
            <h2>Original Head Elements:</h2>
            <DebugHeaderItem title="Original" headers={originalElements} />
            <h2>Sorted Head Elements:</h2>
            <DebugHeaderItem title="Sorted" headers={headElements} />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;