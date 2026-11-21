import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCurrent from './components/WeatherCurrent';
import TelemetryGrid from './components/TelemetryGrid';
import ForecastFiveDay from './components/ForecastFiveDay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ApiKeyModal from './components/ApiKeyModal';
import {
  fetchCurrentWeather,
  fetchWeatherForecast,
  processFiveDayForecast
} from './services/weatherApi';

const STORAGE_KEY_API = 'owm_api_key_v1';
const STORAGE_KEY_UNITS = 'owm_units_v1';
const STORAGE_KEY_RECENT = 'owm_recent_queries_v1';
const STORAGE_KEY_LAST_CITY = 'owm_last_city_v1';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY_API) || '');
  const [units, setUnits] = useState(() => localStorage.getItem(STORAGE_KEY_UNITS) || 'metric');
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem(STORAGE_KEY_LAST_CITY) || 'Tokyo');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT)) || ['Tokyo', 'London', 'New York'];
    } catch {
      return ['Tokyo', 'London', 'New York'];
    }
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastDaily, setForecastDaily] = useState([]);
  const [forecastRawHourly, setForecastRawHourly] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const abortControllerRef = useRef(null);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setError({
        code: 'OFFLINE',
        message: 'Internet connection lost. Waiting for connectivity to resume live telemetry updates.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UNITS, units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(STORAGE_KEY_API, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY_API);
    }
  }, [apiKey]);

  /**
   * Main asynchronous weather loading function
   */
  const loadWeatherData = useCallback(
    async ({ query, coords, isRefresh = false }) => {
      if (!isOnline && !apiKey) {
        // can still show simulated data offline if needed
      }

      // Abort previous pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const [current, forecast] = await Promise.all([
          fetchCurrentWeather({
            query,
            coords,
            units,
            apiKey,
            signal
          }),
          fetchWeatherForecast({
            query,
            coords,
            units,
            apiKey,
            signal
          })
        ]);

        setCurrentWeather(current);

        const timezoneOffset = current.timezone || 0;
        const dailySummary = processFiveDayForecast(forecast.list || [], timezoneOffset);
        setForecastDaily(dailySummary);
        setForecastRawHourly(forecast.list || []);

        const resolvedCityName = current.name || query;
        if (resolvedCityName && !coords) {
          setCurrentCity(resolvedCityName);
          localStorage.setItem(STORAGE_KEY_LAST_CITY, resolvedCityName);

          // Update recent searches
          setRecentSearches((prev) => {
            const filtered = prev.filter((c) => c.toLowerCase() !== resolvedCityName.toLowerCase());
            return [resolvedCityName, ...filtered].slice(0, 7);
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        console.error('Weather acquisition failed:', err);
        setError({
          message: err.message,
          code: err.code || 'TELEMETRY_ERROR',
          status: err.status || 500
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [apiKey, units, isOnline]
  );

  // Initial load
  useEffect(() => {
    loadWeatherData({ query: currentCity });
  }, [currentCity, units, apiKey, loadWeatherData]);

  // Handle Search
  const handleSearch = (city) => {
    if (!city) return;
    setCurrentCity(city);
    loadWeatherData({ query: city });
  };

  // Handle Manual Refresh
  const handleRefresh = () => {
    if (currentWeather?.coord) {
      loadWeatherData({
        coords: { lat: currentWeather.coord.lat, lon: currentWeather.coord.lon },
        isRefresh: true
      });
    } else {
      loadWeatherData({ query: currentCity, isRefresh: true });
    }
  };

  // Handle Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError({
        code: 'GEO_UNSUPPORTED',
        message: 'Geolocation is not supported by your current browser environment.'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        loadWeatherData({
          coords: { lat: latitude, lon: longitude }
        });
      },
      (geoErr) => {
        setIsLoading(false);
        let msg = 'Failed to acquire device GPS coordinates.';
        if (geoErr.code === 1) msg = 'Location access was denied. Please search your city manually.';
        if (geoErr.code === 2) msg = 'Position unavailable. Please search your city manually.';
        if (geoErr.code === 3) msg = 'GPS timeout occurred.';
        setError({ code: 'GEO_DENIED', message: msg });
      },
      { timeout: 8000 }
    );
  };

  // Handle Clear Recent Searches
  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY_RECENT);
  };

  // Switch to Simulation Mode
  const handleSwitchToSimulation = () => {
    setApiKey('');
    localStorage.removeItem(STORAGE_KEY_API);
    setError(null);
    loadWeatherData({ query: currentCity });
  };

  // Compute dynamic weather atmosphere class for the main container
  const computeAmbianceClass = () => {
    if (!currentWeather) return 'ambiance-default';
    const condition = currentWeather.weather?.[0]?.main?.toLowerCase() || '';
    const icon = currentWeather.weather?.[0]?.icon || '';
    const isNight = icon.endsWith('n');

    if (condition.includes('rain') || condition.includes('drizzle')) return 'ambiance-rain';
    if (condition.includes('thunder') || condition.includes('storm')) return 'ambiance-storm';
    if (condition.includes('snow')) return 'ambiance-snow';
    if (condition.includes('cloud')) return 'ambiance-clouds';
    if (condition.includes('clear')) return isNight ? 'ambiance-night' : 'ambiance-clear';
    if (condition.includes('mist') || condition.includes('fog')) return 'ambiance-mist';
    return isNight ? 'ambiance-night' : 'ambiance-clear';
  };

  return (
    <div className={`app-root ${computeAmbianceClass()}`}>
      <div className="atmospheric-mesh-bg"></div>

      <Header
        units={units}
        onToggleUnits={(newUnits) => setUnits(newUnits)}
        apiKey={apiKey}
        isSimulated={currentWeather?.isSimulated}
        onOpenSettings={() => setIsModalOpen(true)}
        isOnline={isOnline}
      />

      <main className="main-content-layout">
        {/* Search & Location Bar */}
        <SearchBar
          onSearch={handleSearch}
          onLocateMe={handleLocateMe}
          isLoading={isLoading}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <LoadingSpinner targetCity={currentCity} />
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <ErrorMessage
            error={error}
            onRetry={handleRefresh}
            onSwitchToSimulation={handleSwitchToSimulation}
            onOpenApiKeyModal={() => setIsModalOpen(true)}
            onSelectSuggestedCity={(city) => {
              setCurrentCity(city);
              loadWeatherData({ query: city });
            }}
          />
        )}

        {/* Weather Telemetry Dashboard Content */}
        {!isLoading && currentWeather && (
          <div className="telemetry-dashboard-body">
            {/* Main Hero Card: Current Weather, Dynamic Icon, Temperatures */}
            <WeatherCurrent
              current={currentWeather}
              units={units}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Climate Telemetry Grid: Humidity, Wind, Pressure, Visibility, Solar */}
            <TelemetryGrid
              current={currentWeather}
              units={units}
            />

            {/* 5-Day Forecast & Temperature Dynamics Curve */}
            <ForecastFiveDay
              dailyForecast={forecastDaily}
              rawHourlyList={forecastRawHourly}
              units={units}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="telemetry-footer">
        <div className="footer-content">
          <span>AetherTelemetry Station // Powered by OpenWeatherMap REST API</span>
          <span>Asynchronous Real-Time Climate Observation System</span>
        </div>
      </footer>

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={(key) => {
          setApiKey(key);
          setError(null);
        }}
        onUseSimulation={handleSwitchToSimulation}
      />
    </div>
  );
}
