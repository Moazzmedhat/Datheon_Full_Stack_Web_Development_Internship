import React, { useState, useEffect } from 'react';
import { CloudRain, Key, Settings, Globe, Radio, Thermometer, Wifi, WifiOff } from 'lucide-react';

/**
 * Top Header Navigation & Telemetry Console Status Bar
 */
export default function Header({
  units = 'metric',
  onToggleUnits,
  apiKey,
  isSimulated = false,
  onOpenSettings,
  isOnline = true
}) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-telemetry-header">
      <div className="header-brand-wrap">
        <div className="brand-icon-pod">
          <CloudRain size={24} className="brand-icon text-cyan-400" />
          <div className="pod-pulse-ring"></div>
        </div>
        <div className="brand-text-block">
          <h1 className="brand-title">Aether<span className="brand-accent">Telemetry</span></h1>
          <span className="brand-subtitle">Real-Time Weather & Climate Dynamics</span>
        </div>
      </div>

      <div className="header-controls-wrap">
        {/* Connection status badge */}
        <div className={`status-pill ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Online' : 'Offline'}>
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isOnline ? 'METEOR-LINK ACTIVE' : 'NETWORK OFFLINE'}</span>
        </div>

        {/* Live UTC Clock */}
        <div className="utc-clock-badge">
          <span className="clock-dot"></span>
          <span className="clock-time">{utcTime}</span>
        </div>

        {/* Units Switcher Toggle */}
        <div className="units-toggle-pill">
          <button
            type="button"
            onClick={() => onToggleUnits('metric')}
            className={`unit-btn ${units === 'metric' ? 'active' : ''}`}
            title="Metric: Celsius (°C), km/h, hPa"
          >
            °C / km·h
          </button>
          <button
            type="button"
            onClick={() => onToggleUnits('imperial')}
            className={`unit-btn ${units === 'imperial' ? 'active' : ''}`}
            title="Imperial: Fahrenheit (°F), mph, inHg"
          >
            °F / mph
          </button>
        </div>

        {/* Mode / API Key Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`btn-api-settings ${apiKey ? 'has-key' : 'demo-mode'}`}
          title="OpenWeatherMap API Key & Data Source Settings"
        >
          {apiKey ? <Key size={14} /> : <Globe size={14} />}
          <span>{apiKey ? 'Live OWM Key' : 'API Config'}</span>
        </button>
      </div>
    </header>
  );
}
