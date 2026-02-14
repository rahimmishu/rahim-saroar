/**
 * 🔍 Performance Debug Panel (Hidden)
 * ====================================
 * শুধু development mode এ Shift+P চেপে দেখা যাবে
 */

import React, { useState, useEffect } from 'react';

interface PerformanceDebugProps {
  status: {
    connectionSpeed: 'slow' | 'medium' | 'fast';
    cachedImages: number;
    prefetchedUrls: number;
    memoryUsage: number;
  };
}

const PerformanceDebug: React.FC<PerformanceDebugProps> = ({ status }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Shift+P
      if (e.shiftKey && e.key.toLowerCase() === 'p') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') return null;

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'slow': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return '🚀';
      case 'medium': return '⚡';
      case 'slow': return '🐌';
      default: return '❓';
    }
  };

  return (
    <div
      className="fixed p-4 text-white border rounded-lg shadow-2xl bottom-4 right-4 bg-black/90 backdrop-blur-sm border-white/10"
      style={{ zIndex: 9999, fontFamily: 'monospace', fontSize: '12px' }}
    >
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/20">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-bold">Performance Monitor</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/60">Connection:</span>
          <span className={`font-bold ${getSpeedColor(status.connectionSpeed)}`}>
            {getSpeedIcon(status.connectionSpeed)} {status.connectionSpeed.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60">Cached Images:</span>
          <span className="font-bold text-blue-400">{status.cachedImages}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60">Prefetched URLs:</span>
          <span className="font-bold text-purple-400">{status.prefetchedUrls}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60">Memory Usage:</span>
          <span className={`font-bold ${status.memoryUsage > 80 ? 'text-red-400' : 'text-green-400'}`}>
            {status.memoryUsage}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-white/20 text-white/40 text-[10px]">
        Press Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceDebug;