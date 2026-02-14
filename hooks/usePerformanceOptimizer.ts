/**
 * 🎣 usePerformanceOptimizer Hook
 * ================================
 * Hidden performance optimization যা React components এ integrate হবে
 */

import { useEffect, useState } from 'react';
import PerformanceOptimizer from '../lib/PerformanceOptimizer';

interface OptimizationStatus {
  connectionSpeed: 'slow' | 'medium' | 'fast';
  cachedImages: number;
  prefetchedUrls: number;
  memoryUsage: number;
}

export function usePerformanceOptimizer() {
  const [status, setStatus] = useState<OptimizationStatus>({
    connectionSpeed: 'fast',
    cachedImages: 0,
    prefetchedUrls: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // Initialize optimizer (singleton pattern)
    const optimizer = PerformanceOptimizer.getInstance();

    // Update status periodically
    const updateStatus = () => {
      setStatus(optimizer.getStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Every 5 seconds

    // Listen for connection changes
    const handleConnectionChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setStatus(prev => ({
        ...prev,
        connectionSpeed: customEvent.detail.speed
      }));
    };

    window.addEventListener('connectionchange', handleConnectionChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('connectionchange', handleConnectionChange);
    };
  }, []);

  return status;
}

export default usePerformanceOptimizer;