'use client';
import React, { useState } from 'react';
import useHeaderElements from '../capo/useHeaderElements';
import AnalysisResults from './AnalysisResults';
import Recommendations from './Recommendations';
import 'app/ui/capo.css';

const Capo: React.FC = () => {
  const [url, setUrl] = useState('');
  const { originalElements, sortedElements, loading, error } = useHeaderElements(url);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAnalyzeClick = () => {
    if (url) {
      setUrl(url);
    }
  };

  return (
    <div className="capo-container">
      <h1>KWK Analysis with Capo</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter URL to analyze"
          value={url}
          onChange={handleInputChange}
          className="input"
        />
        <button onClick={handleAnalyzeClick} className="button">
          Analyze
        </button>
      </div>

      <div className="results-container">
        <div className="results-section">
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <>
              <AnalysisResults headerElements={originalElements} />
            </>
          )}
        </div>
        <div className="recommendations-section">
          <Recommendations originalElements={originalElements} sortedElements={sortedElements} />
        </div>
      </div>
    </div>
  );
};

export default Capo;