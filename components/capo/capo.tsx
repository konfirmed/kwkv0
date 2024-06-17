'use client';
import React, { useState } from 'react';
import useHeaderElements from '../capo/useHeaderElements';
import AnalysisResults from './AnalysisResults';
import Recommendations from './Recommendations';
import 'app/ui/capo/capo.css';

const Capo: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analyze, setAnalyze] = useState(false);

  // Pass empty string when not analyzing to avoid type issues
  const { originalElements, sortedElements, loading, error } = useHeaderElements(analyze ? url : '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAnalyzeClick = () => {
    if (url) {
      setAnalyze(true);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-xl font-semibold text-[#5d534a]">HEAD DEBUGGER</h1>

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
            {!loading && !error && analyze && (
              <AnalysisResults headerElements={originalElements} />
            )}
          </div>
          <div className="recommendations-section">
            <Recommendations originalElements={originalElements} sortedElements={sortedElements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capo;
