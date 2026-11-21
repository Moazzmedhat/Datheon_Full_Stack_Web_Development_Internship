import React, { useState } from 'react';
import { Search, MapPin, X, History, Sparkles } from 'lucide-react';

const QUICK_CITIES = ['Tokyo', 'London', 'New York', 'Paris', 'Sydney', 'Cairo', 'Dubai'];

/**
 * Search Bar Component
 * Provides city search, geolocation trigger, quick preset chips,
 * and recent query history.
 */
export default function SearchBar({
  onSearch,
  onLocateMe,
  isLoading = false,
  recentSearches = [],
  onClearRecent
}) {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setShowHistory(false);
  };

  const handleSelectQuick = (city) => {
    setQuery(city);
    onSearch(city);
    setShowHistory(false);
  };

  return (
    <div className="search-section-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-shell">
          <Search size={20} className="search-magnifier-icon" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => recentSearches.length > 0 && setShowHistory(true)}
            placeholder="Search any global city, e.g. 'Tokyo', 'London, GB', 'San Francisco'..."
            className="search-text-input"
            disabled={isLoading}
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="btn-clear-query"
              title="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLoading}
            className="btn-geo-locate"
            title="Use current geolocation coordinates"
          >
            <MapPin size={17} />
            <span className="geo-label">Locate Me</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-submit-search"
          >
            {isLoading ? (
              <span className="btn-spinner"></span>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>

        {/* Recent Search Dropdown */}
        {showHistory && recentSearches.length > 0 && (
          <div className="search-history-dropdown">
            <div className="history-dropdown-header">
              <span className="history-title">
                <History size={14} /> Recent Queries
              </span>
              <button
                type="button"
                onClick={onClearRecent}
                className="btn-clear-history"
              >
                Clear all
              </button>
            </div>
            <div className="history-items-list">
              {recentSearches.map((city, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuick(city)}
                  className="history-item-btn"
                >
                  <MapPin size={13} className="text-cyan-400" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick Select Preset City Chips */}
      <div className="quick-cities-strip">
        <span className="quick-label">
          <Sparkles size={13} className="text-cyan-400" /> Quick Stations:
        </span>
        <div className="quick-chips-wrap">
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectQuick(city)}
              className="quick-city-chip"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
