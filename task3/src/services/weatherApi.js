/**
 * Real-Time Weather Forecast & Climate Telemetry API Service
 * Integrates OpenWeatherMap REST API with error handling,
 * request cancellation, and fallback telemetry simulation.
 */

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OWM_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Known preset telemetry profiles for instant realistic simulation
const PRESET_CITIES = {
  tokyo: {
    name: 'Tokyo',
    country: 'JP',
    lat: 35.6762,
    lon: 139.6503,
    timezone: 32400, // UTC+9
    baseTemp: 18,
    weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
    humidity: 52,
    pressure: 1016,
    windSpeed: 4.1,
    windDeg: 70,
    visibility: 10000,
    clouds: 10
  },
  london: {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    timezone: 0,
    baseTemp: 12,
    weather: { main: 'Rain', description: 'light rain', icon: '10d' },
    humidity: 84,
    pressure: 1008,
    windSpeed: 6.2,
    windDeg: 230,
    visibility: 8000,
    clouds: 85
  },
  'new york': {
    name: 'New York',
    country: 'US',
    lat: 40.7128,
    lon: -74.006,
    timezone: -18000, // UTC-5
    baseTemp: 15,
    weather: { main: 'Clouds', description: 'overcast clouds', icon: '04d' },
    humidity: 65,
    pressure: 1014,
    windSpeed: 5.5,
    windDeg: 310,
    visibility: 10000,
    clouds: 90
  },
  paris: {
    name: 'Paris',
    country: 'FR',
    lat: 48.8566,
    lon: 2.3522,
    timezone: 3600, // UTC+1
    baseTemp: 14,
    weather: { main: 'Clouds', description: 'broken clouds', icon: '03d' },
    humidity: 71,
    pressure: 1012,
    windSpeed: 3.8,
    windDeg: 190,
    visibility: 10000,
    clouds: 60
  },
  sydney: {
    name: 'Sydney',
    country: 'AU',
    lat: -33.8688,
    lon: 151.2093,
    timezone: 39600, // UTC+11
    baseTemp: 23,
    weather: { main: 'Clear', description: 'sunny and warm', icon: '01d' },
    humidity: 58,
    pressure: 1020,
    windSpeed: 5.1,
    windDeg: 140,
    visibility: 10000,
    clouds: 15
  },
  cairo: {
    name: 'Cairo',
    country: 'EG',
    lat: 30.0444,
    lon: 31.2357,
    timezone: 7200, // UTC+2
    baseTemp: 27,
    weather: { main: 'Clear', description: 'clear sunny sky', icon: '01d' },
    humidity: 38,
    pressure: 1015,
    windSpeed: 3.2,
    windDeg: 350,
    visibility: 9000,
    clouds: 0
  },
  dubai: {
    name: 'Dubai',
    country: 'AE',
    lat: 25.2048,
    lon: 55.2708,
    timezone: 14400, // UTC+4
    baseTemp: 31,
    weather: { main: 'Clear', description: 'bright sun and haze', icon: '01d' },
    humidity: 45,
    pressure: 1011,
    windSpeed: 4.8,
    windDeg: 300,
    visibility: 8500,
    clouds: 5
  },
  reykjavik: {
    name: 'Reykjavík',
    country: 'IS',
    lat: 64.1466,
    lon: -21.9426,
    timezone: 0,
    baseTemp: 2,
    weather: { main: 'Snow', description: 'light snow flurries', icon: '13d' },
    humidity: 89,
    pressure: 998,
    windSpeed: 8.5,
    windDeg: 60,
    visibility: 6000,
    clouds: 95
  }
};

/**
 * Generate synthetic forecast data based on city telemetry profile
 */
function generateSyntheticTelemetry(cityQuery, units = 'metric') {
  const normKey = cityQuery.toLowerCase().trim();
  let baseProfile = PRESET_CITIES[normKey];

  if (!baseProfile) {
    // Deterministic hash based on city name for consistent simulation
    let hash = 0;
    for (let i = 0; i < cityQuery.length; i++) {
      hash = (hash << 5) - hash + cityQuery.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const tempCelsius = 10 + (absHash % 22); // 10 to 32 C
    const conditions = [
      { main: 'Clear', description: 'clear sunny skies', icon: '01d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Clouds', description: 'overcast cloud cover', icon: '04d' },
      { main: 'Rain', description: 'moderate rain showers', icon: '10d' },
      { main: 'Thunderstorm', description: 'stormy conditions with rain', icon: '11d' }
    ];
    const pickedWeather = conditions[absHash % conditions.length];

    baseProfile = {
      name: cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1),
      country: 'INTL',
      lat: Number((((absHash % 1400) / 10) - 70).toFixed(4)),
      lon: Number((((absHash % 3600) / 10) - 180).toFixed(4)),
      timezone: ((absHash % 25) - 12) * 3600,
      baseTemp: tempCelsius,
      weather: pickedWeather,
      humidity: 40 + (absHash % 50),
      pressure: 995 + (absHash % 35),
      windSpeed: Number((2 + (absHash % 120) / 10).toFixed(1)),
      windDeg: absHash % 360,
      visibility: 8000 + (absHash % 3000),
      clouds: absHash % 100
    };
  }

  // Convert temperature to requested unit if needed
  const toUnitTemp = (celsius) => {
    if (units === 'imperial') return Number((celsius * 1.8 + 32).toFixed(1));
    return Number(celsius.toFixed(1));
  };

  const toUnitSpeed = (ms) => {
    if (units === 'imperial') return Number((ms * 2.23694).toFixed(1));
    return Number((ms * 3.6).toFixed(1)); // km/h
  };

  const nowSec = Math.floor(Date.now() / 1000);
  const currentTemp = toUnitTemp(baseProfile.baseTemp);

  // Current Weather payload structured like OpenWeatherMap
  const currentWeather = {
    coord: { lon: baseProfile.lon, lat: baseProfile.lat },
    weather: [
      {
        id: 800,
        main: baseProfile.weather.main,
        description: baseProfile.weather.description,
        icon: baseProfile.weather.icon
      }
    ],
    base: 'stations',
    main: {
      temp: currentTemp,
      feels_like: toUnitTemp(baseProfile.baseTemp + (baseProfile.humidity > 60 ? 1.5 : -1)),
      temp_min: toUnitTemp(baseProfile.baseTemp - 2.5),
      temp_max: toUnitTemp(baseProfile.baseTemp + 3.2),
      pressure: baseProfile.pressure,
      humidity: baseProfile.humidity,
      sea_level: baseProfile.pressure,
      grnd_level: baseProfile.pressure - 5
    },
    visibility: baseProfile.visibility,
    wind: {
      speed: toUnitSpeed(baseProfile.windSpeed),
      deg: baseProfile.windDeg,
      gust: toUnitSpeed(baseProfile.windSpeed * 1.4)
    },
    clouds: { all: baseProfile.clouds },
    dt: nowSec,
    sys: {
      type: 1,
      id: 1234,
      country: baseProfile.country,
      sunrise: nowSec - 18000,
      sunset: nowSec + 25200
    },
    timezone: baseProfile.timezone,
    id: 999999,
    name: baseProfile.name,
    cod: 200,
    isSimulated: true
  };

  // Generate 40 3-hour forecast points (5 days)
  const forecastList = [];
  const weatherVariations = [
    { main: 'Clear', desc: 'clear sky', icon: '01d' },
    { main: 'Clouds', desc: 'scattered clouds', icon: '03d' },
    { main: 'Clouds', desc: 'broken clouds', icon: '04d' },
    { main: 'Rain', desc: 'light rain', icon: '10d' },
    { main: 'Clear', desc: 'sunny', icon: '01d' },
    { main: 'Clouds', desc: 'overcast', icon: '04d' }
  ];

  for (let i = 0; i < 40; i++) {
    const timestamp = nowSec + (i + 1) * 3 * 3600;
    // Diurnal temperature cycle: peaks around afternoon, lowers at night
    const hourOfDay = (new Date(timestamp * 1000).getUTCHours() + Math.floor(baseProfile.timezone / 3600) + 24) % 24;
    const diurnalOffset = Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI) * 4;
    const dayTrend = Math.sin((i / 8) * 1.5) * 2;
    const tempC = baseProfile.baseTemp + diurnalOffset + dayTrend;
    const weatherIndex = (Math.floor(i / 4) + Math.abs(baseProfile.windDeg)) % weatherVariations.length;
    const chosenW = weatherVariations[weatherIndex];
    const isNight = hourOfDay < 6 || hourOfDay > 20;
    const iconCode = isNight ? chosenW.icon.replace('d', 'n') : chosenW.icon;

    forecastList.push({
      dt: timestamp,
      main: {
        temp: toUnitTemp(tempC),
        feels_like: toUnitTemp(tempC - 0.5),
        temp_min: toUnitTemp(tempC - 1.2),
        temp_max: toUnitTemp(tempC + 1.2),
        pressure: baseProfile.pressure + Math.round(Math.sin(i / 2) * 4),
        sea_level: baseProfile.pressure,
        grnd_level: baseProfile.pressure - 5,
        humidity: Math.min(98, Math.max(25, baseProfile.humidity + Math.round(Math.cos(i) * 15))),
        temp_kf: 0
      },
      weather: [
        {
          id: 800,
          main: chosenW.main,
          description: chosenW.desc,
          icon: iconCode
        }
      ],
      clouds: { all: Math.min(100, Math.max(0, baseProfile.clouds + Math.round(Math.sin(i) * 20))) },
      wind: {
        speed: toUnitSpeed(Math.max(1, baseProfile.windSpeed + Math.sin(i) * 1.5)),
        deg: (baseProfile.windDeg + i * 10) % 360,
        gust: toUnitSpeed(baseProfile.windSpeed * 1.5)
      },
      visibility: baseProfile.visibility,
      pop: chosenW.main === 'Rain' ? 0.75 : 0.1,
      dt_txt: new Date(timestamp * 1000).toISOString().replace('T', ' ').substring(0, 19)
    });
  }

  const forecast = {
    cod: '200',
    message: 0,
    cnt: 40,
    list: forecastList,
    city: {
      id: 999999,
      name: baseProfile.name,
      coord: { lat: baseProfile.lat, lon: baseProfile.lon },
      country: baseProfile.country,
      population: 1000000,
      timezone: baseProfile.timezone,
      sunrise: nowSec - 18000,
      sunset: nowSec + 25200
    },
    isSimulated: true
  };

  return { currentWeather, forecast };
}

/**
 * Fetch current weather from OpenWeatherMap API asynchronously
 */
export async function fetchCurrentWeather({ query, coords, units = 'metric', apiKey = '', signal }) {
  if (!apiKey || apiKey.trim() === '') {
    // If no API key is provided, return synthetic telemetry
    const cityName = query || (coords ? `Lat ${coords.lat.toFixed(1)}, Lon ${coords.lon.toFixed(1)}` : 'London');
    const sim = generateSyntheticTelemetry(cityName, units);
    return sim.currentWeather;
  }

  let url;
  if (coords) {
    url = `${OWM_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=${units}&appid=${apiKey.trim()}`;
  } else {
    url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(query.trim())}&units=${units}&appid=${apiKey.trim()}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    handleHttpError(response.status, errorData, query);
  }

  const data = await response.json();
  data.isSimulated = false;
  return data;
}

/**
 * Fetch 5-day / 3-hour forecast from OpenWeatherMap API asynchronously
 */
export async function fetchWeatherForecast({ query, coords, units = 'metric', apiKey = '', signal }) {
  if (!apiKey || apiKey.trim() === '') {
    const cityName = query || (coords ? `Lat ${coords.lat.toFixed(1)}, Lon ${coords.lon.toFixed(1)}` : 'London');
    const sim = generateSyntheticTelemetry(cityName, units);
    return sim.forecast;
  }

  let url;
  if (coords) {
    url = `${OWM_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${units}&appid=${apiKey.trim()}`;
  } else {
    url = `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(query.trim())}&units=${units}&appid=${apiKey.trim()}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    handleHttpError(response.status, errorData, query);
  }

  const data = await response.json();
  data.isSimulated = false;
  return data;
}

/**
 * Standardized error handling for OpenWeatherMap responses
 */
function handleHttpError(status, errorData, query) {
  const message = errorData?.message || '';

  if (status === 404) {
    const err = new Error(`City "${query}" not found in OpenWeatherMap registry. Please verify spelling (e.g., "Tokyo", "Paris, FR", or "London, GB").`);
    err.code = 'CITY_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  if (status === 401) {
    const err = new Error('Invalid OpenWeatherMap API Key. If you just generated this key, please allow 10-15 minutes for OpenWeatherMap activation, or switch to simulated telemetry.');
    err.code = 'INVALID_API_KEY';
    err.status = 401;
    throw err;
  }

  if (status === 429) {
    const err = new Error('OpenWeatherMap API rate limit exceeded (60 calls/minute limit reached). Please wait a moment or test with simulation mode.');
    err.code = 'RATE_LIMITED';
    err.status = 429;
    throw err;
  }

  const generalMsg = message || `HTTP error ${status} encountered while querying OpenWeatherMap.`;
  const err = new Error(generalMsg);
  err.code = 'API_ERROR';
  err.status = status;
  throw err;
}

/**
 * Group raw 3-hour forecast intervals into 5 daily summaries
 */
export function processFiveDayForecast(rawForecastList, timezoneOffset = 0) {
  if (!rawForecastList || rawForecastList.length === 0) return [];

  // Group by local calendar date (YYYY-MM-DD)
  const daysMap = new Map();

  rawForecastList.forEach((item) => {
    // Offset timestamp by city timezone offset
    const localDate = new Date((item.dt + timezoneOffset) * 1000);
    const dateKey = localDate.toISOString().slice(0, 10);

    if (!daysMap.has(dateKey)) {
      daysMap.set(dateKey, {
        dateKey,
        dayName: localDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        monthDay: localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        temps: [],
        humidities: [],
        pressures: [],
        windSpeeds: [],
        conditions: [],
        icons: [],
        descriptions: [],
        hourly: []
      });
    }

    const dayObj = daysMap.get(dateKey);
    dayObj.temps.push(item.main.temp);
    dayObj.humidities.push(item.main.humidity);
    dayObj.pressures.push(item.main.pressure);
    dayObj.windSpeeds.push(item.wind.speed);

    const condition = item.weather[0]?.main || 'Clear';
    const icon = item.weather[0]?.icon || '01d';
    const desc = item.weather[0]?.description || 'clear';

    dayObj.conditions.push(condition);
    dayObj.icons.push(icon);
    dayObj.descriptions.push(desc);

    const hourStr = localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
    dayObj.hourly.push({
      dt: item.dt,
      time: hourStr,
      temp: Math.round(item.main.temp),
      condition,
      description: desc,
      icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      pop: Math.round((item.pop || 0) * 100)
    });
  });

  // Convert map to array of daily aggregates
  const dailyList = Array.from(daysMap.values()).map((day) => {
    const minTemp = Math.round(Math.min(...day.temps));
    const maxTemp = Math.round(Math.max(...day.temps));
    const avgHumidity = Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length);
    const avgPressure = Math.round(day.pressures.reduce((a, b) => a + b, 0) / day.pressures.length);
    const maxWind = Number(Math.max(...day.windSpeeds).toFixed(1));

    // Determine most frequent condition and midday icon
    // Prefer midday icon (around index length / 2) for daylight representation
    const midIdx = Math.floor(day.icons.length / 2);
    const primaryIcon = day.icons[midIdx] || day.icons[0];
    const primaryCondition = day.conditions[midIdx] || day.conditions[0];
    const primaryDescription = day.descriptions[midIdx] || day.descriptions[0];

    return {
      dateKey: day.dateKey,
      dayName: day.dayName,
      monthDay: day.monthDay,
      minTemp,
      maxTemp,
      avgHumidity,
      avgPressure,
      maxWind,
      condition: primaryCondition,
      description: primaryDescription,
      icon: primaryIcon,
      hourly: day.hourly
    };
  });

  // Return up to 5 consecutive forecast days
  return dailyList.slice(0, 5);
}

/**
 * Helper to translate cardinal directions from degrees
 */
export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Pressure categorization and tendency
 */
export function getPressureAnalysis(hPa) {
  if (hPa < 1000) return { label: 'Low Pressure', detail: 'Cyclonic / Storm potential', status: 'low' };
  if (hPa > 1022) return { label: 'High Pressure', detail: 'Anticyclonic / Fair skies', status: 'high' };
  return { label: 'Normal / Stable', detail: 'Standard atmospheric equilibrium', status: 'normal' };
}

/**
 * Humidity comfort rating
 */
export function getHumidityRating(humidity) {
  if (humidity < 30) return { label: 'Arid / Dry', color: '#38bdf8' };
  if (humidity <= 60) return { label: 'Optimal / Comfortable', color: '#10b981' };
  if (humidity <= 80) return { label: 'Humid / Muggy', color: '#f59e0b' };
  return { label: 'Tropical / Saturated', color: '#ef4444' };
}
