import { useEffect, useRef } from 'react';
import { triggerIsland } from './DynamicIsland';

interface WelcomeGreetingProps {
  ready?: boolean; // Preloader শেষ হলে true হবে
}

const getGreeting = (hour: number): { text: string; emoji: string } => {
  if (hour >= 5  && hour < 12) return { text: 'Good Morning',   emoji: '🌅' };
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (hour >= 17 && hour < 21) return { text: 'Good Evening',   emoji: '🌆' };
  return                               { text: 'Good Night',     emoji: '🌙' };
};

const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '🌍';
  return code.toUpperCase().split('').map(c =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  ).join('');
};

const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ ready = false }) => {
  const hasRun = useRef(false);

  useEffect(() => {
    // ready না হলে, বা আগেই চালানো হলে — কিছু করবো না
    if (!ready || hasRun.current) return;
    if (sessionStorage.getItem('welcome_shown')) return;

    hasRun.current = true;

    const showGreeting = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('ipapi failed');
        const data = await res.json();

        const city    = data.city         || 'Your City';
        const country = data.country_name || '';
        const tzName  = data.timezone;

        const localHour = tzName
          ? parseInt(new Intl.DateTimeFormat('en', {
              hour: 'numeric', hour12: false, timeZone: tzName
            }).format(new Date()))
          : new Date().getHours();

        const { text, emoji } = getGreeting(localHour);
        const flag = countryFlag(data.country_code || '');
        const location = country ? `${city}, ${country}` : city;
        const msg = `${emoji} ${text}! Visitor from ${flag} ${location} — Welcome to Mishu's World 👋`;

        // Preloader শেষে ১৫s পর smooth open, ৫s দেখিয়ে smooth close
        setTimeout(() => {
          triggerIsland(msg, 'info', 5000);
          sessionStorage.setItem('welcome_shown', '1');
        }, 15000);

      } catch {
        const { text, emoji } = getGreeting(new Date().getHours());
        setTimeout(() => {
          triggerIsland(`${emoji} ${text}! Welcome to Mishu's World 👋`, 'success', 5000);
          sessionStorage.setItem('welcome_shown', '1');
        }, 15000);
      }
    };

    showGreeting();
  }, [ready]);

  return null;
};

export default WelcomeGreeting;