"use client";
// pages/index.tsx
import React, { useState, useEffect } from 'react';

export default function Home() {
    const [urlInput, setUrlInput] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);

    const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInput(event.target.value);
    };

    const handleGetLoafClick = () => {
        // Fetch LoAF data
        fetchLoafData();
    };

    const handleToggleViewClick = () => {
        setIsMobileView(prevIsMobileView => !prevIsMobileView);
    };

    const fetchLoafData = () => {
        // Fetch LoAF data based on the provided URL
        fetch(`/api/loaf?url=${urlInput}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        const loaFEntries: PerformanceEntry[] = performance.getEntriesByType('long-animation-frame');
        const eventEntries: PerformanceEntry[] = performance.getEntriesByType('event');

        // Send pending LoAF and event entries to API for processing
        fetch('/api/loaf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loaFEntries,
                eventEntries,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div>
            <h1>Homepage</h1>
            <div>
                <input
                    type="text"
                    value={urlInput}
                    onChange={handleUrlInputChange}
                    placeholder="Enter URL"
                />
                <button onClick={handleGetLoafClick}>Get Loaf</button>
            </div>
            <div>
                <button onClick={handleToggleViewClick}>
                    {isMobileView ? 'Switch to Desktop View' : 'Switch to Mobile View'}
                </button>
            </div>
        </div>
    );
}
