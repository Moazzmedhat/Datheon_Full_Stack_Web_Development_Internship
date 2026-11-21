import React, { useState, useEffect } from 'react';
import { Radio, Wifi } from 'lucide-react';

/**
 * Climate Telemetry Loading Spinner Component
 * Displays a radar pulse animation with cycling telemetry synchronization steps.
 */
export default function LoadingSpinner({ targetCity = '' }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    `Connecting to meteorological telemetry network...`,
    `Querying OpenWeatherMap REST endpoints for ${targetCity || 'station'}...`,
    `Computing humidity, wind vectors, and barometric gradient...`,
    `Synthesizing 5-day predictive temperature projection...`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="telemetry-loading-container">
      <div className="radar-scanner-box">
        {/* Pulsing Concentric Radar Rings */}
        <div className="radar-ring ring-outer"></div>
        <div className="radar-ring ring-mid"></div>
        <div className="radar-ring ring-inner"></div>

        {/* Rotating Radar Sweep Line */}
        <div className="radar-sweep-beam"></div>

        {/* Center Satellite Node */}
        <div className="radar-center-node">
          <Radio size={24} className="radar-node-icon text-cyan-300" />
        </div>
      </div>

      <div className="loading-text-wrap">
        <div className="loading-main-heading">
          <Wifi size={16} className="text-cyan-400 live-pulse-icon" />
          <span>Synchronizing Atmospheric Telemetry</span>
        </div>
        <p className="loading-sub-step">{steps[stepIndex]}</p>
      </div>
    </div>
  );
}
