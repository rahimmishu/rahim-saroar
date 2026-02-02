import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, 
  CloudRain, Snowflake, CloudLightning, Droplets, Wind, X 
} from 'lucide-react';
import './WeatherApp.css';

interface WeatherAppProps {
  onClose: () => void;
}

const WeatherApp: React.FC<WeatherAppProps> = ({ onClose }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [themeStyles, setThemeStyles] = useState({});
  // JSX.Element এর বদলে React.ReactNode ব্যবহার করুন
const [particles, setParticles] = useState<React.ReactNode[]>([]);

  // Weather Code Mapping
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

  const updateTheme = (code: number) => {
    let colors = { bg1: "#020617", bg2: "#1e293b", glow: "rgba(96, 165, 250, 0.15)" };

    if (code === 0) colors = { bg1: "#0c4a6e", bg2: "#0ea5e9", glow: "rgba(253, 224, 71, 0.3)" };
    else if (code >= 51 && code <= 67) colors = { bg1: "#0f172a", bg2: "#1e1b4b", glow: "rgba(59, 130, 246, 0.2)" };
    else if (code >= 71) colors = { bg1: "#334155", bg2: "#94a3b8", glow: "rgba(255, 255, 255, 0.2)" };

    setThemeStyles({
      '--bg-color-1': colors.bg1,
      '--bg-color-2': colors.bg2,
      '--glow-color': colors.glow,
    } as React.CSSProperties);
  };

  const createParticles = (code: number) => {
    let type = (code >= 51 && code <= 67) ? 'rain-drop' : (code >= 71 ? 'snow-flake' : null);
    if (!type) {
      setParticles([]);
      return;
    }

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
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`);
      const data = await weatherRes.json();

      setWeatherData({
        name: `${name}, ${country}`,
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        code: data.current.weather_code,
        daily: data.daily
      });

      updateTheme(data.current.weather_code);
      createParticles(data.current.weather_code);

    } catch (error) {
      alert("City not found or API error!");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load (Default London)
  useEffect(() => {
    fetchWeather('Dhaka');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="duration-300 weather-app-wrapper animate-in zoom-in" style={themeStyles}>
      <button onClick={onClose} className="wa-close-btn"><X size={24} /></button>
      
      <div className="weather-effects">{particles}</div>
      <div className="bg-glow"></div>

      <main className="wa-glass-card">
        <form className="search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="wa-input"
            placeholder="Enter city..." 
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
          <div className="weather-info">
            <h2 style={{ fontWeight: 500 }}>{weatherData.name}</h2>
            <div style={{ margin: '15px 0' }}>
              {getWeatherIcon(weatherData.code, 80)}
            </div>
            <h1 className="temp-val">{weatherData.temp}°C</h1>
            <div className="desc-pill">{getWeatherDesc(weatherData.code)}</div>

            <div className="metrics">
              <div className="metric-item">
                <Droplets size={18} style={{ color: "var(--primary)" }} />
                <label>Humidity</label>
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="metric-item">
                <Wind size={18} style={{ color: "var(--primary)" }} />
                <label>Wind</label>
                <span>{weatherData.wind} km/h</span>
              </div>
            </div>

            <div className="forecast-container">
              <div className="forecast-grid">
                {weatherData.daily.time.slice(1, 6).map((time: string, i: number) => {
                  const day = new Date(time).toLocaleDateString('en', { weekday: 'short' });
                  const code = weatherData.daily.weather_code[i + 1];
                  const maxTemp = Math.round(weatherData.daily.temperature_2m_max[i + 1]);
                  return (
                    <div key={i} className="forecast-item">
                      <span className="forecast-day">{day}</span>
                      {getWeatherIcon(code, 20)}
                      <span className="forecast-temp">{maxTemp}°</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <p>Search for a city...</p>
        )}
      </main>
    </div>
  );
};

export default WeatherApp;