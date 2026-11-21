import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  Cloudy,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Wind,
  Eye
} from 'lucide-react';

/**
 * Dynamic Weather Icon Component
 * Maps OpenWeatherMap icon codes and conditions to expressive Lucide icons
 * with glow filters, animations, and official fallback.
 */
export default function WeatherIcon({
  iconCode = '01d',
  condition = 'Clear',
  size = 48,
  className = '',
  useOfficialImage = false
}) {
  if (useOfficialImage && iconCode) {
    return (
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt={condition}
        width={size}
        height={size}
        className={`weather-official-icon ${className}`}
        loading="lazy"
      />
    );
  }

  const isNight = iconCode.endsWith('n');
  const codePrefix = iconCode.substring(0, 2);

  // Return custom animated Lucide icon based on prefix or condition name
  switch (codePrefix) {
    case '01': // Clear sky
      return isNight ? (
        <Moon
          size={size}
          className={`icon-moon text-indigo-200 ${className}`}
          strokeWidth={1.8}
        />
      ) : (
        <Sun
          size={size}
          className={`icon-sun text-amber-400 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '02': // Few clouds
      return isNight ? (
        <CloudMoon
          size={size}
          className={`icon-cloud-moon text-blue-300 ${className}`}
          strokeWidth={1.8}
        />
      ) : (
        <CloudSun
          size={size}
          className={`icon-cloud-sun text-amber-300 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '03': // Scattered clouds
      return (
        <Cloud
          size={size}
          className={`icon-cloud text-slate-300 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '04': // Broken clouds / Overcast
      return (
        <Cloudy
          size={size}
          className={`icon-clouds text-slate-400 ${className}`}
          strokeWidth={2}
        />
      );

    case '09': // Shower rain
      return (
        <CloudDrizzle
          size={size}
          className={`icon-drizzle text-sky-400 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '10': // Rain
      return (
        <CloudRain
          size={size}
          className={`icon-rain text-blue-400 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '11': // Thunderstorm
      return (
        <CloudLightning
          size={size}
          className={`icon-thunder text-amber-300 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '13': // Snow
      return (
        <Snowflake
          size={size}
          className={`icon-snow text-cyan-200 ${className}`}
          strokeWidth={1.8}
        />
      );

    case '50': // Mist / Fog / Haze
      return (
        <Wind
          size={size}
          className={`icon-mist text-slate-300 ${className}`}
          strokeWidth={1.8}
        />
      );

    default:
      // Fallback by condition string
      if (/rain|shower|drizzle/i.test(condition)) {
        return <CloudRain size={size} className={`icon-rain text-blue-400 ${className}`} />;
      }
      if (/cloud|overcast/i.test(condition)) {
        return <Cloud size={size} className={`icon-cloud text-slate-300 ${className}`} />;
      }
      if (/snow|flurr|ice/i.test(condition)) {
        return <Snowflake size={size} className={`icon-snow text-cyan-200 ${className}`} />;
      }
      if (/thunder|storm/i.test(condition)) {
        return <CloudLightning size={size} className={`icon-thunder text-amber-300 ${className}`} />;
      }
      return <Sun size={size} className={`icon-sun text-amber-400 ${className}`} />;
  }
}
