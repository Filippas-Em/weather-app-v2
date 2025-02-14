'use client';
import React, { useEffect, useState } from 'react';

export default function PrimaryCardInfo() {
    const [params, setParams] = useState({});

    const updateParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        setParams({
            location: searchParams.get('location'),
            selected: searchParams.get('selected'),
            units: searchParams.get('units'),
            country: searchParams.get('country'),
        });
    };

    useEffect(() => {
        // Initialize params on component mount
        updateParams();

        // Listen for browser navigation
        window.addEventListener('popstate', updateParams);

        // Listen for custom events when pushState is used
        const handleCustomEvent = () => updateParams();
        window.addEventListener('customPushState', handleCustomEvent);

        return () => {
            window.removeEventListener('popstate', updateParams);
            window.removeEventListener('customPushState', handleCustomEvent);
        };
    }, []);

    useEffect(() => {
        console.log("Updated params:", params);
    }, [params]);

    return (
        <div className="primary-card-info">
            <div className="country-date">
                <h1>{params.location || 'Athens'}, {params.country || 'GR'}</h1>
                <p>Today, 14/2/2025</p>
            </div>
        </div>
    );
}

// Override the default pushState method
(() => {
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
        // Call the original pushState
        originalPushState.apply(this, args);
        
        // Dispatch a custom event to notify about the URL change
        const event = new Event('customPushState');
        window.dispatchEvent(event);
    };
})();
