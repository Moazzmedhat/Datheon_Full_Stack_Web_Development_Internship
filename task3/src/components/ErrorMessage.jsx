import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw, Key, Globe, Search, ArrowRight } from 'lucide-react';

/**
 * Graceful Error Handling Component
 * Handles invalid city errors, API key issues, rate limits, and network dropouts.
 */
export default function ErrorMessage({
  error,
  onRetry,
  onSwitchToSimulation,
  onOpenApiKeyModal,
  onSelectSuggestedCity
}) {
  if (!error) return null;

  const isCityNotFound = error.code === 'CITY_NOT_FOUND' || error.status === 404;
  const isAuthError = error.code === 'INVALID_API_KEY' || error.status === 401;
  const isRateLimited = error.code === 'RATE_LIMITED' || error.status === 429;
  const isOffline = error.code === 'OFFLINE';

  const suggestedCities = ['Tokyo', 'London', 'New York', 'Paris', 'Sydney'];

  return (
    <div className="error-banner-container">
      <div className="error-card">
        <div className="error-icon-column">
          {isCityNotFound ? (
            <Search size={32} className="error-icon text-amber-400" />
          ) : isAuthError ? (
            <Key size={32} className="error-icon text-rose-400" />
          ) : (
            <AlertTriangle size={32} className="error-icon text-rose-400" />
          )}
        </div>

        <div className="error-body">
          <div className="error-title-row">
            <span className="error-badge">
              {isCityNotFound
                ? 'City Not Found (404)'
                : isAuthError
                ? 'OpenWeatherMap Authentication Error (401)'
                : isRateLimited
                ? 'API Rate Limit Reached (429)'
                : isOffline
                ? 'Network Disconnected'
                : 'Telemetry Signal Failure'}
            </span>
          </div>

          <p className="error-description-text">{error.message || 'An unexpected error occurred while fetching weather data.'}</p>

          {/* Suggestions & Recovery Options */}
          {isCityNotFound && (
            <div className="error-recovery-section">
              <span className="recovery-lead">Did you mean one of these global stations?</span>
              <div className="recovery-chips-list">
                {suggestedCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => onSelectSuggestedCity(city)}
                    className="recovery-city-btn"
                  >
                    <span>{city}</span>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isAuthError && (
            <div className="error-action-buttons">
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="btn-error-action btn-primary-action"
              >
                <Key size={15} />
                <span>Configure OpenWeatherMap Key</span>
              </button>

              <button
                type="button"
                onClick={onSwitchToSimulation}
                className="btn-error-action btn-secondary-action"
              >
                <Globe size={15} />
                <span>Switch to Simulation Mode</span>
              </button>
            </div>
          )}

          {!isAuthError && !isCityNotFound && (
            <div className="error-action-buttons">
              <button
                type="button"
                onClick={onRetry}
                className="btn-error-action btn-primary-action"
              >
                <RefreshCw size={15} />
                <span>Retry Transmission</span>
              </button>

              <button
                type="button"
                onClick={onSwitchToSimulation}
                className="btn-error-action btn-secondary-action"
              >
                <Globe size={15} />
                <span>Test via Telemetry Simulator</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
