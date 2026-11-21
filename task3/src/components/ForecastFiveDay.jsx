import React, { useState } from 'react';
import { Calendar, ChevronRight, TrendingUp, Clock, Umbrella } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import TemperatureChart from './TemperatureChart';

/**
 * 5-Day Forecast & Temperature Projection Component
 * Features interactive daily cards, expandable hourly breakdown,
 * and continuous temperature dynamics chart.
 */
export default function ForecastFiveDay({
  dailyForecast = [],
  rawHourlyList = [],
  units = 'metric'
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'chart'

  if (!dailyForecast || dailyForecast.length === 0) return null;

  const unitSymbol = units === 'imperial' ? '°F' : '°C';
  const selectedDay = dailyForecast[selectedDayIndex] || dailyForecast[0];

  // Overall min and max across all 5 days for relative bar scaling
  const allMins = dailyForecast.map((d) => d.minTemp);
  const allMaxs = dailyForecast.map((d) => d.maxTemp);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalSpan = globalMax - globalMin || 1;

  // Prepare data points for chart
  const chartData = (rawHourlyList && rawHourlyList.length > 0 ? rawHourlyList : []).map((item) => {
    const d = new Date(item.dt * 1000);
    return {
      temp: item.main.temp,
      timeLabel: d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      condition: item.weather[0]?.main || 'Clear'
    };
  });

  return (
    <div className="forecast-section">
      <div className="forecast-header-row">
        <div className="section-title-wrap">
          <Calendar size={18} className="text-cyan-400" />
          <h3 className="section-heading">5-Day Temperature & Climate Forecast</h3>
        </div>

        <div className="forecast-view-toggles">
          <button
            onClick={() => setViewMode('cards')}
            className={`btn-view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
          >
            Daily Cards
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`btn-view-toggle ${viewMode === 'chart' ? 'active' : ''}`}
          >
            <TrendingUp size={14} className="inline-icon" />
            Trend Curve
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="chart-view-panel">
          <TemperatureChart
            data={chartData.length > 0 ? chartData.slice(0, 32) : []}
            unitSymbol={unitSymbol}
          />
        </div>
      ) : (
        <div className="forecast-cards-grid">
          {dailyForecast.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            // Bar calculation
            const leftPercent = ((day.minTemp - globalMin) / globalSpan) * 100;
            const widthPercent = Math.max(15, ((day.maxTemp - day.minTemp) / globalSpan) * 100);

            return (
              <div
                key={day.dateKey}
                onClick={() => setSelectedDayIndex(idx)}
                className={`forecast-day-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="day-card-header">
                  <span className="day-name">{idx === 0 ? 'Today' : day.dayName}</span>
                  <span className="month-day">{day.monthDay}</span>
                </div>

                <div className="day-card-icon-wrap">
                  <WeatherIcon
                    iconCode={day.icon}
                    condition={day.condition}
                    size={38}
                    className="day-weather-icon"
                  />
                  <span className="day-condition-tag">{day.condition}</span>
                </div>

                {/* Min/Max Temperature Visual Bar */}
                <div className="day-temp-bar-container">
                  <span className="day-temp-min">{day.minTemp}{unitSymbol}</span>
                  <div className="temp-range-track">
                    <div
                      className="temp-range-gradient"
                      style={{
                        marginLeft: `${Math.max(0, Math.min(80, leftPercent))}%`,
                        width: `${Math.min(100 - leftPercent, widthPercent)}%`
                      }}
                    ></div>
                  </div>
                  <span className="day-temp-max">{day.maxTemp}{unitSymbol}</span>
                </div>

                <div className="day-card-footer">
                  <span>Hum: {day.avgHumidity}%</span>
                  <span>Wind: {day.maxWind}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Day Hourly Telemetry Detail */}
      {selectedDay && selectedDay.hourly && selectedDay.hourly.length > 0 && (
        <div className="hourly-breakdown-panel">
          <div className="hourly-panel-header">
            <Clock size={16} className="text-cyan-400" />
            <h4>
              3-Hour Atmospheric Intervals for{' '}
              <strong className="text-cyan-300">
                {selectedDayIndex === 0 ? 'Today' : selectedDay.dayName} ({selectedDay.monthDay})
              </strong>
            </h4>
          </div>

          <div className="hourly-scroll-strip">
            {selectedDay.hourly.map((interval, i) => (
              <div key={i} className="hourly-interval-chip">
                <span className="interval-time">{interval.time}</span>
                <WeatherIcon
                  iconCode={interval.icon}
                  condition={interval.condition}
                  size={28}
                  className="interval-icon"
                />
                <span className="interval-temp">
                  {interval.temp}{unitSymbol}
                </span>
                <span className="interval-condition">{interval.condition}</span>
                {interval.pop > 0 && (
                  <span className="interval-pop">
                    <Umbrella size={11} /> {interval.pop}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
