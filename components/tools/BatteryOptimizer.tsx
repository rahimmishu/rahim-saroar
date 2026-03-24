import React, { useEffect, useRef } from 'react';
import { triggerIsland } from '../layout/DynamicIsland';

interface BatteryOptimizerProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const BatteryOptimizer: React.FC<BatteryOptimizerProps> = ({ isDarkMode, toggleTheme }) => {
  // নোটিফিকেশন বারবার যাতে না দেখায় তার জন্য ফ্ল্যাগ
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // ব্রাউজার সাপোর্ট চেক
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        
        const checkBattery = () => {
          const level = battery.level * 100; // 0.2 -> 20%
          const isCharging = battery.charging;

          // লজিক: চার্জ ২০% এর কম + চার্জে লাগানো নেই + এখনো ডার্ক মোড নেই
          if (level <= 20 && !isCharging && !hasTriggeredRef.current) {
            
            if (!isDarkMode) {
              toggleTheme(); // অটো ডার্ক মোড অন
              triggerIsland(`Battery Low (${Math.round(level)}%)! Switched to Dark Mode 🔋`, "error");
            } else {
              triggerIsland(`Battery Low (${Math.round(level)}%)! Save Power ⚡`, "error");
            }
            
            hasTriggeredRef.current = true; // একবারই ট্রিগার হবে
          }
        };

        // পেজ লোড হলে একবার চেক করবে
        checkBattery();

        // ইভেন্ট লিসেনার (চার্জ কমলে বা চার্জে লাগালে ডিটেক্ট করবে)
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', () => {
          // চার্জে লাগালে রিসেট হবে, যাতে পরে আবার কাজ করে
          if (battery.charging) hasTriggeredRef.current = false;
        });
      });
    }
  }, [isDarkMode, toggleTheme]);

  return null; // এটি একটি লজিক্যাল কম্পোনেন্ট, তাই কিছু রেন্ডার করবে না
};

export default BatteryOptimizer;