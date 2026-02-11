// 📱 useMobileDetect.ts
// মোবাইল ব্রাউজার detect করে — Chrome desktop mode বাদে সব মোবাইল ব্রাউজার
// Chrome desktop mode এ window.innerWidth >= 1024 এবং userAgent এ "Mobile" থাকে না

import { useState, useEffect } from 'react';

/**
 * মোবাইল ব্রাউজার কিনা detect করে।
 * - Chrome "Request Desktop Site" = false (desktop mode, হাত দেওয়া নেই)
 * - Samsung, Firefox, Opera, Brave Mobile = true (lite version দেখাবে)
 */
export function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent;

      // ✅ Chrome desktop mode detection:
      // "Request Desktop Site" চালু হলে: screen width বড় কিন্তু তবুও "Mobile" থাকে ua তে
      // কিন্তু chrome desktop mode এ viewport width সাধারণত 1024px+ হয়
      // আর "CriOS" (Chrome iOS) বা "Chrome" + "Mobile" = real mobile
      
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      
      // Chrome এর "Desktop Site" mode detect
      // Desktop Site mode এ: userAgent এ "Mobile" থাকে না (Android Chrome)
      // কিন্তু সত্যিকারের desktop এও থাকে না
      // তাই touch capability + screen size দিয়ে judge করি
      
      const hasMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Samsung|Mobile/i.test(ua);
      
      // Chrome "Desktop Site" mode: Chrome + Android/iOS কিন্তু "Mobile" UA string নাও থাকতে পারে
      // তবে touch events থাকবে
      const isDesktopChromeMode = /Chrome/.test(ua) && !hasMobileUA && isTouchDevice;
      
      if (isDesktopChromeMode) {
        // Chrome Desktop mode — lite version দেওয়ার দরকার নেই
        setIsMobile(false);
        return;
      }

      // সত্যিকারের মোবাইল: touch device + small screen বা mobile UA
      const result = isTouchDevice && (isSmallScreen || hasMobileUA);
      setIsMobile(result);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default useMobileDetect;