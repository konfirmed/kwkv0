import React from 'react';
import {DebugHeaderItem} from '../capo/DebugHeaderItem';
import styles from 'app/ui/AnalysisResults.module.css';

interface AnalysisResultsProps {
  headerElements: Array<{ tagName: string; attributes: Array<{ name: string; value: string }> }>;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ headerElements }) => {
  return (
    <div className={styles.analysisResults}>
      <h2>Analysis Results</h2>
      <div className={styles.content}>
        {headerElements.length > 0 ? (
          <DebugHeaderItem title="Headers" headers={headerElements} />
        ) : (
          <p>No headers available</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;