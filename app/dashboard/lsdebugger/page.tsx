"use client"
import React, { useState } from 'react';
import CLSAnalyzer from '../../ui/dashboard/lsd';
import URLInput from '../../ui/dashboard/urlinput';

const LSDebuggerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');

  return (
    <div>
      <h2>LS Debugger Page</h2>
      <URLInput
        value={url}
        onSubmit={(enteredURL) => setUrl(enteredURL)}
        onFormFactorChange={(formFactor) => console.log('Form Factor:', formFactor)}
        onNetworkTypeChange={(networkType) => console.log('Network Type:', networkType)}
        formFactor="DESKTOP"
        networkType="4g"
        placeholder="Enter URL"
      />
      <CLSAnalyzer url={url} />
    </div>
  );
};

export default LSDebuggerPage;
