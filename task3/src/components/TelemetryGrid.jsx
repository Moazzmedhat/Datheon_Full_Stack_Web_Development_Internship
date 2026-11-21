import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloudy,
  Sunrise,
  Sunset,
  Navigation,
  Activity
} from 'lucide-react';
import {
  getWindDirection,
  getPressureAnalysis,
  getHumidityRating
} from '../services/weatherApi';

/**
 * Telemetry Grid Component
 * Displays real-time atmospheric readings:
 * Humidity, Wind Speed, Atmospheric Pressure, Visibility, Clouds, Solar Cycle
 */
export default function TelemetryGrid({ current, units = 'metric' }) {
  if (!current) return null;

  const humidity = current.main?.humidity ?? 0;
  const pressure = current.main?.pressure ?? 1013;
  const windSpeed = current.wind?.speed ?? 0;
  const windDeg = current.wind?.deg ?? 0;
  const windGust = current.wind?.gust;
  const visibility = current.visibility ?? 10000;
  const clouds = current.clouds?.all ?? 0;

  const windDirLabel = getWindDirection(windDeg);
  const pressureMeta = getPressureAnalysis(pressure);
  const humidityMeta = getHumidityRating(humidity);

  // Speed and distance units formatting
  const speedUnit = units === 'imperial' ? 'mph' : 'km/h';
  const visibilityFormatted =
    units === 'imperial'
      ? `${(visibility / 1609.34).toFixed(1)} mi`
      : `${(visibility / 1000).toFixed(1)} km`;

  // Format local sunrise and sunset with timezone offset
  const timezoneOffset = current.timezone || 0;
  const formatSunTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  };

  const sunriseStr = formatSunTime(current.sys?.sunrise);
  const sunsetStr = formatSunTime(current.sys?.sunset);

  return (
    <div className="telemetry-grid-section">
      <div className="section-title-wrap">
        <Activity size={18} className="text-cyan-400" />
        <h3 className="section-heading">Climate Telemetry & Atmospheric Metrics</h3>
      </div>

      <div className="telemetry-cards-container">
        {/* Humidity Card */}
        <div className="telemetry-card card-humidity">
          <div className="card-top">
            <div className="metric-label">
              <Droplets size={18} className="metric-icon text-cyan-400" />
              <span>Humidity Level</span>
            </div>
            <span
              className="metric-pill"
              style={{ color: humidityMeta.color, borderColor: humidityMeta.color }}
            >
              {humidityMeta.label}
            </span>
          </div>
          <div className="metric-main-value">
            <span className="big-number">{humidity}</span>
            <span className="unit-symbol">%</span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill humidity-fill"
              style={{ width: `${Math.min(100, Math.max(5, humidity))}%` }}
            ></div>
          </div>
          <div className="card-subtext">
            <span>Moisture saturation</span>
            <span>Dew Point: ~{Math.round((current.main?.temp || 0) - (100 - humidity) / 5)}°</span>
          </div>
        </div>

        {/* Wind Speed & Compass Card */}
        <div className="telemetry-card card-wind">
          <div className="card-top">
            <div className="metric-label">
              <Wind size={18} className="metric-icon text-teal-400" />
              <span>Wind Dynamics</span>
            </div>
            <span className="metric-pill pill-cyan">
              {windDirLabel} • {windDeg}°
            </span>
          </div>
          <div className="wind-display-row">
            <div className="metric-main-value">
              <span className="big-number">{windSpeed}</span>
              <span className="unit-symbol">{speedUnit}</span>
            </div>
            {/* Live Rotating Compass Needle */}
            <div className="compass-visual" title={`Bearing ${windDeg}° ${windDirLabel}`}>
              <div
                className="compass-needle"
                style={{ transform: `rotate(${windDeg}deg)` }}
              >
                <Navigation size={22} className="needle-icon" />
              </div>
              <span className="compass-n">N</span>
            </div>
          </div>
          <div className="card-subtext">
            <span>Direction: {windDirLabel} ({windDeg}°)</span>
            <span>{windGust ? `Gusts: ${windGust} ${speedUnit}` : 'Steady airflow'}</span>
          </div>
        </div>

        {/* Atmospheric Pressure Card */}
        <div className="telemetry-card card-pressure">
          <div className="card-top">
            <div className="metric-label">
              <Gauge size={18} className="metric-icon text-indigo-400" />
              <span>Atmospheric Pressure</span>
            </div>
            <span className={`metric-pill pill-${pressureMeta.status}`}>
              {pressureMeta.label}
            </span>
          </div>
          <div className="metric-main-value">
            <span className="big-number">{pressure}</span>
            <span className="unit-symbol">hPa</span>
          </div>
          <div className="pressure-barometer-scale">
            <div className="scale-markers">
              <span>970</span>
              <span className="active-marker">1013</span>
              <span>1050</span>
            </div>
            <div className="scale-track">
              <div
                className="scale-indicator"
                style={{
                  left: `${Math.min(95, Math.max(5, ((pressure - 970) / (1050 - 970)) * 100))}%`
                }}
              ></div>
            </div>
          </div>
          <div className="card-subtext">
            <span>{pressureMeta.detail}</span>
          </div>
        </div>

        {/* Visibility & Cloud Cover Card */}
        <div className="telemetry-card card-visibility">
          <div className="card-top">
            <div className="metric-label">
              <Eye size={18} className="metric-icon text-amber-400" />
              <span>Optical Visibility</span>
            </div>
            <span className="metric-pill pill-amber">
              {visibility >= 10000 ? 'Clear Horizon' : 'Restricted'}
            </span>
          </div>
          <div className="metric-main-value">
            <span className="big-number">{visibilityFormatted}</span>
          </div>
          <div className="cloud-coverage-row">
            <Cloudy size={16} className="text-slate-400" />
            <span className="coverage-text">Cloud Cover: <strong>{clouds}%</strong></span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill cloud-fill"
              style={{ width: `${Math.min(100, Math.max(2, clouds))}%` }}
            ></div>
          </div>
        </div>

        {/* Ephemeris / Sun Cycle Card */}
        <div className="telemetry-card card-solar span-two">
          <div className="card-top">
            <div className="metric-label">
              <Sunrise size={18} className="metric-icon text-amber-400" />
              <span>Solar Telemetry & Day Cycle</span>
            </div>
            <span className="metric-pill pill-neutral">
              Geo: {current.coord?.lat?.toFixed(2)}°, {current.coord?.lon?.toFixed(2)}°
            </span>
          </div>
          <div className="solar-cycle-grid">
            <div className="solar-item">
              <div className="solar-icon-wrap dawn">
                <Sunrise size={22} />
              </div>
              <div>
                <span className="solar-caption">Sunrise</span>
                <div className="solar-time">{sunriseStr}</div>
              </div>
            </div>

            <div className="solar-item">
              <div className="solar-icon-wrap dusk">
                <Sunset size={22} />
              </div>
              <div>
                <span className="solar-caption">Sunset</span>
                <div className="solar-time">{sunsetStr}</div>
              </div>
            </div>

            <div className="solar-item">
              <div className="solar-icon-wrap coords">
                <Compass size={22} />
              </div>
              <div>
                <span className="solar-caption">Station Zone</span>
                <div className="solar-time">
                  UTC{timezoneOffset >= 0 ? `+${timezoneOffset / 3600}` : `${timezoneOffset / 3600}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
