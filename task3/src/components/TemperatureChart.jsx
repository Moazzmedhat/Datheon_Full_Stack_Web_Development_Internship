import React, { useState } from 'react';

/**
 * Responsive SVG Temperature Trend Line Chart
 * Visualizes the 5-day or 24-hour continuous temperature telemetry curve
 * with glowing area gradients and interactive tooltips.
 */
export default function TemperatureChart({ data = [], unitSymbol = '°C' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>No telemetry curve data available.</p>
      </div>
    );
  }

  // Calculate scales and coordinates
  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 35;

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  // Coordinate mapping
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.temp - minTemp) / tempRange) * (height - paddingY * 2);
    return { ...d, x, y };
  });

  // Generate smooth SVG bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="telemetry-chart-container">
      <div className="chart-header">
        <div className="chart-title-wrap">
          <span className="telemetry-indicator-dot"></span>
          <h4>Temperature Dynamics & Trend Analysis</h4>
        </div>
        <div className="chart-legend">
          <span className="legend-badge min-badge">Min: {Math.round(minTemp)}{unitSymbol}</span>
          <span className="legend-badge max-badge">Max: {Math.round(maxTemp)}{unitSymbol}</span>
        </div>
      </div>

      <div className="svg-chart-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="telemetry-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            className="chart-grid-line"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            className="chart-grid-line"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            className="chart-grid-line"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#tempGradient)" />

          {/* Spline stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3.2"
            filter="url(#glow)"
          />

          {/* Vertical guideline on hover */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingY}
              x2={hoveredPoint.x}
              y2={height - paddingY}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          )}

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredPoint && hoveredPoint.index === i;
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  className={`chart-data-point ${isHovered ? 'active' : ''}`}
                  fill={isHovered ? '#ffffff' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint({ ...pt, index: i })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Time labels for sampled intervals */}
                {i % Math.ceil(points.length / 8) === 0 && (
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    className="chart-axis-label"
                  >
                    {pt.timeLabel || pt.dayName || ''}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div
            className="chart-floating-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${hoveredPoint.y - 25}px`
            }}
          >
            <div className="tooltip-time">{hoveredPoint.timeLabel || hoveredPoint.time || hoveredPoint.dayName}</div>
            <div className="tooltip-temp">
              {Math.round(hoveredPoint.temp)}{unitSymbol}
            </div>
            {hoveredPoint.condition && (
              <div className="tooltip-condition">{hoveredPoint.condition}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
