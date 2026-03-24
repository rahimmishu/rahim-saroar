import React, { useState, useEffect } from 'react';
import {
  Search, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle,
  CloudRain, Snowflake, CloudLightning, Droplets, Wind, X,
  Thermometer, Gauge, Umbrella, Zap, Sunrise, Sunset, Clock
} from 'lucide-react';
import './WeatherApp.css';

interface WeatherAppProps {
  onClose: () => void;
}

type Tab = 'now' | 'hourly' | 'daily';

const WeatherApp: React.FC<WeatherAppProps> = ({ onClose }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [themeStyles, setThemeStyles] = useState({});
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('now');

  const getWeatherIcon = (code: number, size = 70) => {
    const props = { size, color: "var(--primary)" };
    if (code === 0) return <Sun {...props} />;
    if (code === 1 || code === 2) return <CloudSun {...props} />;
    if (code === 3) return <Cloud {...props} />;
    if (code === 45 || code === 48) return <CloudFog {...props} />;
    if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
    if (code >= 61 && code <= 67) return <CloudRain {...props} />;
    if (code >= 71 && code <= 77) return <Snowflake {...props} />;
    if (code >= 80 && code <= 82) return <CloudRain {...props} />;
    if (code >= 95) return <CloudLightning {...props} />;
    return <Cloud {...props} />;
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code === 1 || code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 95) return "Stormy";
    return "Cloudy";
  };

  const getUVLabel = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: '#4ade80' };
    if (uv <= 5) return { label: 'Moderate', color: '#facc15' };
    if (uv <= 7) return { label: 'High', color: '#fb923c' };
    if (uv <= 10) return { label: 'Very High', color: '#f87171' };
    return { label: 'Extreme', color: '#c084fc' };
  };

  const updateTheme = (code: number) => {
    let colors = { bg1: "#020617", bg2: "#1e293b", glow: "rgba(96, 165, 250, 0.15)" };
    if (code === 0) colors = { bg1: "#0c4a6e", bg2: "#0ea5e9", glow: "rgba(253, 224, 71, 0.3)" };
    else if (code >= 51 && code <= 67) colors = { bg1: "#0f172a", bg2: "#1e1b4b", glow: "rgba(59, 130, 246, 0.2)" };
    else if (code >= 71) colors = { bg1: "#334155", bg2: "#94a3b8", glow: "rgba(255, 255, 255, 0.2)" };
    else if (code >= 95) colors = { bg1: "#1c1917", bg2: "#292524", glow: "rgba(250, 204, 21, 0.2)" };
    setThemeStyles({
      '--bg-color-1': colors.bg1,
      '--bg-color-2': colors.bg2,
      '--glow-color': colors.glow,
    } as React.CSSProperties);
  };

  const createParticles = (code: number) => {
    const type = (code >= 51 && code <= 67) ? 'rain-drop' : (code >= 71 ? 'snow-flake' : null);
    if (!type) { setParticles([]); return; }
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      const style = {
        left: Math.random() * 100 + '%',
        animationDuration: (Math.random() * (type === 'rain-drop' ? 0.5 : 3) + 0.5) + 's',
        animationDelay: Math.random() * 2 + 's'
      };
      newParticles.push(<div key={i} className={type} style={style}></div>);
    }
    setParticles(newParticles);
  };

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity) return;
    setLoading(true);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results) throw new Error("City not found");

      const { latitude, longitude, name, country } = geoData.results[0];

      // ✅ UPGRADED API CALL — more variables
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,uv_index,pressure_msl` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
        `&timezone=auto&forecast_days=7`
      );
      const data = await weatherRes.json();
      const c = data.current;

      // Get next 12 hours only
      const nowIndex = data.hourly.time.findIndex((t: string) => new Date(t) >= new Date());
      const hourlySlice = {
        time: data.hourly.time.slice(nowIndex, nowIndex + 12),
        temperature_2m: data.hourly.temperature_2m.slice(nowIndex, nowIndex + 12),
        weather_code: data.hourly.weather_code.slice(nowIndex, nowIndex + 12),
      };

      setWeatherData({
        name: `${name}, ${country}`,
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        wind: c.wind_speed_10m,
        precipitation: c.precipitation,
        uvIndex: Math.round(c.uv_index),
        pressure: Math.round(c.pressure_msl),
        code: c.weather_code,
        daily: data.daily,
        hourly: hourlySlice,
      });

      updateTheme(c.weather_code);
      createParticles(c.weather_code);
    } catch {
      alert("City not found or API error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather('Dhaka'); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const formatHour = (timeStr: string) => {
    const d = new Date(timeStr);
    return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatSunTime = (timeStr: string) => {
    if (!timeStr) return '--';
    const d = new Date(timeStr);
    return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="duration-300 weather-app-wrapper animate-in zoom-in" style={themeStyles}>
      <button onClick={onClose} className="wa-close-btn"><X size={24} /></button>
      <div className="weather-effects">{particles}</div>
      <div className="bg-glow"></div>

      <main className="wa-glass-card">
        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="wa-input"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="wa-search-btn">
            <Search size={18} />
          </button>
        </form>

        {loading ? (
          <div className="wa-loading" style={{ padding: '50px' }}>
            <Sun size={50} color="var(--primary)" />
          </div>
        ) : weatherData ? (
          <>
            {/* City + Icon + Temp */}
            <h2 className="wa-city-name">{weatherData.name}</h2>
            <div style={{ margin: '12px 0' }}>{getWeatherIcon(weatherData.code, 72)}</div>
            <h1 className="temp-val">{weatherData.temp}°C</h1>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="desc-pill">{getWeatherDesc(weatherData.code)}</span>
              <span className="desc-pill" style={{ opacity: 0.7 }}>Feels {weatherData.feelsLike}°C</span>
            </div>

            {/* Tabs */}
            <div className="wa-tabs">
              {(['now', 'hourly', 'daily'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  className={`wa-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'now' ? 'Now' : tab === 'hourly' ? '12h' : '7 Days'}
                </button>
              ))}
            </div>

            {/* NOW TAB */}
            {activeTab === 'now' && (
              <>
                <div className="metrics">
                  <div className="metric-item">
                    <Droplets size={16} style={{ color: "var(--primary)" }} />
                    <label>Humidity</label>
                    <span>{weatherData.humidity}%</span>
                  </div>
                  <div className="metric-item">
                    <Wind size={16} style={{ color: "var(--primary)" }} />
                    <label>Wind</label>
                    <span>{weatherData.wind} km/h</span>
                  </div>
                  <div className="metric-item">
                    <Umbrella size={16} style={{ color: "var(--primary)" }} />
                    <label>Precip.</label>
                    <span>{weatherData.precipitation} mm</span>
                  </div>
                  <div className="metric-item">
                    <Gauge size={16} style={{ color: "var(--primary)" }} />
                    <label>Pressure</label>
                    <span>{weatherData.pressure} hPa</span>
                  </div>
                </div>

                {/* UV Index */}
                <div className="uv-bar-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>
                      <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />UV Index
                    </span>
                    <span style={{ fontSize: '0.75rem', color: getUVLabel(weatherData.uvIndex).color }}>
                      {weatherData.uvIndex} — {getUVLabel(weatherData.uvIndex).label}
                    </span>
                  </div>
                  <div className="uv-bar-track">
                    <div
                      className="uv-bar-fill"
                      style={{
                        width: `${Math.min((weatherData.uvIndex / 11) * 100, 100)}%`,
                        background: getUVLabel(weatherData.uvIndex).color
                      }}
                    />
                  </div>
                </div>

                {/* Sunrise / Sunset */}
                <div className="sun-times">
                  <div className="sun-item">
                    <Sunrise size={16} style={{ color: '#fbbf24' }} />
                    <label>Sunrise</label>
                    <span>{formatSunTime(weatherData.daily.sunrise?.[0])}</span>
                  </div>
                  <div className="sun-divider" />
                  <div className="sun-item">
                    <Sunset size={16} style={{ color: '#f97316' }} />
                    <label>Sunset</label>
                    <span>{formatSunTime(weatherData.daily.sunset?.[0])}</span>
                  </div>
                </div>
              </>
            )}

            {/* HOURLY TAB */}
            {activeTab === 'hourly' && (
              <div className="forecast-container">
                <div className="forecast-grid" style={{ gap: '6px' }}>
                  {weatherData.hourly.time.map((t: string, i: number) => (
                    <div key={i} className="forecast-item">
                      <Clock size={10} style={{ opacity: 0.5 }} />
                      <span className="forecast-day">{formatHour(t)}</span>
                      {getWeatherIcon(weatherData.hourly.weather_code[i], 18)}
                      <span className="forecast-temp">{Math.round(weatherData.hourly.temperature_2m[i])}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DAILY TAB */}
            {activeTab === 'daily' && (
              <div className="forecast-container">
                <div className="daily-grid">
                  {weatherData.daily.time.slice(0, 7).map((time: string, i: number) => {
                    const day = new Date(time).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
                    const code = weatherData.daily.weather_code[i];
                    const maxT = Math.round(weatherData.daily.temperature_2m_max[i]);
                    const minT = Math.round(weatherData.daily.temperature_2m_min[i]);
                    const rain = weatherData.daily.precipitation_sum[i];
                    return (
                      <div key={i} className="daily-item">
                        <span className="daily-day">{i === 0 ? 'Today' : day}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {getWeatherIcon(code, 18)}
                          <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{rain > 0 ? `${rain}mm` : ''}</span>
                        </div>
                        <div className="daily-temps">
                          <span style={{ color: '#f87171' }}>{maxT}°</span>
                          <span style={{ opacity: 0.4 }}>/</span>
                          <span style={{ color: '#93c5fd' }}>{minT}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Search for a city...</p>
        )}
      </main>
    </div>
  );
};

export default WeatherApp;