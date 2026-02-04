import React from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <label className="switch">
      {/* React State এর মাধ্যমে চেকড ভ্যালু কন্ট্রোল করা হচ্ছে */}
      <input 
        type="checkbox" 
        checked={!isDark} // Note: ডিজাইন অনুযায়ী চেকড হলে আকাশী (Light Mode), আনচেকড হলে কালো (Dark Mode)
        onChange={toggleTheme} 
      />
      <span className="slider">
        <div className="moons-hole">
          <div className="moon-hole"></div>
          <div className="moon-hole"></div>
          <div className="moon-hole"></div>
        </div>
        <div className="black-clouds">
          <div className="black-cloud"></div>
          <div className="black-cloud"></div>
          <div className="black-cloud"></div>
        </div>
        <div className="clouds">
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
        </div>
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
          ))}
        </div>
      </span>
    </label>
  );
};

export default ThemeToggle;