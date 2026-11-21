import React from 'react';
import { MapPin, RefreshCw, Thermometer, Clock, Radio, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

/**
 * Current Weather Hero Display Component
 * Presents primary real-time conditions: temperature, weather description,
 * dynamic weather icon, min/max range, and station sync telemetry.
 */
export default function WeatherCurrent({
  current,
  units = 'metric',
  onRefresh,
  isRefreshing = false
}) {
  if (!current) return null;

  const temp = Math.round(current.main?.temp ?? 0);
  const feelsLike = Math.round(current.main?.feels_like ?? 0);
  const tempMin = Math.round(current.main?.temp_min ?? temp);
  const tempMax = Math.round(current.main?.temp_max ?? temp);

  const weatherObj = current.weather?.[0] || {};
  const condition = weatherObj.main || 'Clear';
  const description = weatherObj.description || 'clear skies';
  const iconCode = weatherObj.icon || '01d';

  const unitSymbol = units === 'imperial' ? '°F' : '°C';
  const cityName = current.name || 'Unknown Station';
  const country = current.sys?.country || '';

  // Calculate local time at weather station
  const timezoneOffset = current.timezone || 0;
  const stationLocalDate = new Date(Date.now() + timezoneOffset * 1000);
  const localTimeStr = stationLocalDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
  const localDateStr = stationLocalDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div className="current-weather-hero">
      <div className="hero-backdrop-glow"></div>

      {/* Top Header Row of Hero */}
      <div className="hero-meta-row">
        <div className="city-location-wrap">
          <div className="location-title">
            <MapPin size={22} className="text-cyan-400 pin-bounce" />
            <h2>{cityName}</h2>
            {country && <span className="country-chip">{country}</span>}
          </div>
          <div className="location-time-info">
            <Clock size={14} className="text-slate-400" />
            <span>Station Local: {localDateStr} • {localTimeStr}</span>
          </div>
        </div>

        <div className="hero-actions-wrap">
          <span className={`telemetry-source-badge ${current.isSimulated ? 'badge-sim' : 'badge-live'}`}>
            <span className="live-pulse-dot"></span>
            {current.isSimulated ? 'Simulation Telemetry' : 'Live OWM REST API'}
          </span>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`btn-refresh-telemetry ${isRefreshing ? 'spinning' : ''}`}
            title="Force refresh live weather telemetry"
          >
            <RefreshCw size={15} />
            <span>{isRefreshing ? 'Acquiring...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Icon Visual */}
      <div className="hero-main-display">
        <div className="temp-primary-block">
          <div className="temp-value-row">
            <span className="current-temp-number">{temp}</span>
            <span className="current-temp-unit">{unitSymbol}</span>
          </div>

          <div className="temp-secondary-pills">
            <span className="temp-pill feels-like">
              <Thermometer size={14} />
              Feels like <strong>{feelsLike}{unitSymbol}</strong>
            </span>
            <span className="temp-pill range-pill">
              ↓ {tempMin}{unitSymbol} / ↑ {tempMax}{unitSymbol}
            </span>
          </div>
        </div>

        <div className="condition-visual-block">
          <div className="dynamic-icon-stage">
            <WeatherIcon
              iconCode={iconCode}
              condition={condition}
              size={96}
              className="hero-weather-icon"
            />
          </div>
          <div className="condition-text-info">
            <div className="condition-title">{condition}</div>
            <div className="condition-description">
              <Sparkles size={13} className="text-cyan-400 inline-icon" />
              <span>{description.charAt(0).toUpperCase() + description.slice(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
