"use client";
import { useState } from 'react';
import axios from 'axios';
import fetchCrUXMetrics from '@/app/lib/crux';

const CruxReport = () => {
    const [url, setUrl] = useState('');
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    const handleFetchReport = async () => {
        try {
            const response = await axios.post('/lib/crux', { url });
            setReport(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching CrUX report:', error);
            setReport(null);
            setError('Failed to fetch the report. Please try again.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL including https://"
            />
            <button type='button' onClick={handleFetchReport}>Fetch Report</button>

            {error && <p>{error}</p>}

            {report && (
                <div>
                    <h2>CrUX Report for {url}</h2>
                    <pre>{JSON.stringify(report, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CruxReport;