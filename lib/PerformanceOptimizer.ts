/**
 * 🚀 Hidden Performance Optimizer
 * ================================
 * Background optimization যা user দেখবে না কিন্তু speed boost করবে
 * Design, Animation, Effect কিছুই নষ্ট হবে না!
 */

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private connectionSpeed: 'slow' | 'medium' | 'fast' = 'fast';
  private observer: IntersectionObserver | null = null;
  private prefetchedUrls = new Set<string>();
  private imageCache = new Map<string, HTMLImageElement>();

  private constructor() {
    this.detectConnectionSpeed();
    this.setupResourceHints();
    this.optimizeImages();
    this.setupMemoryManagement();
    this.setupPrefetching();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // 📡 Connection Speed Detection
  private detectConnectionSpeed() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      
      // Update speed based on effective type
      const updateSpeed = () => {
        if (conn.effectiveType === '4g') {
          this.connectionSpeed = 'fast';
        } else if (conn.effectiveType === '3g') {
          this.connectionSpeed = 'medium';
        } else {
          this.connectionSpeed = 'slow';
        }
        
        // Dispatch event for React components to listen
        window.dispatchEvent(new CustomEvent('connectionchange', { 
          detail: { speed: this.connectionSpeed } 
        }));
      };

      updateSpeed();
      conn.addEventListener('change', updateSpeed);
    }

    // Fallback: measure actual download speed
    this.measureDownloadSpeed();
  }

  // 🔍 Measure actual download speed
  private async measureDownloadSpeed() {
    try {
      const startTime = performance.now();
      const response = await fetch('/favicon.png', { cache: 'no-store' });
      await response.blob();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Estimate speed based on favicon download time
      if (duration < 100) this.connectionSpeed = 'fast';
      else if (duration < 300) this.connectionSpeed = 'medium';
      else this.connectionSpeed = 'slow';
      
    } catch (error) {
      console.log('Speed test skipped');
    }
  }

  // 🎯 Resource Hints Setup
  private setupResourceHints() {
    // Preconnect to important domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://firebasestorage.googleapis.com',
      'https://cdn.jsdelivr.net'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // 🖼️ Intelligent Image Optimization
  private optimizeImages() {
    // Lazy load images that are off-screen
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Load image based on connection speed
            if (img.dataset.src) {
              const src = this.connectionSpeed === 'slow' && img.dataset.lowsrc
                ? img.dataset.lowsrc
                : img.dataset.src;
              
              this.loadImage(img, src);
              this.observer?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.01
      }
    );

    // Observe all lazy images
    this.observeLazyImages();
  }

  // 👁️ Observe lazy images
  private observeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.observer?.observe(img));
  }

  // 📥 Load image with caching
  private loadImage(img: HTMLImageElement, src: string) {
    // Check cache first
    if (this.imageCache.has(src)) {
      img.src = src;
      img.classList.add('loaded');
      return;
    }

    // Load and cache
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      this.imageCache.set(src, tempImg);
    };
    tempImg.src = src;
  }

  // 🧠 Memory Management
  private setupMemoryManagement() {
    // Clear old caches periodically
    setInterval(() => {
      if (this.imageCache.size > 100) {
        // Keep only last 50 images
        const entries = Array.from(this.imageCache.entries());
        this.imageCache.clear();
        entries.slice(-50).forEach(([key, value]) => {
          this.imageCache.set(key, value);
        });
      }
    }, 60000); // Every minute

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
          // Clear caches if memory is high
          this.imageCache.clear();
          this.prefetchedUrls.clear();
        }
      }, 30000); // Every 30 seconds
    }
  }

  // 🔮 Intelligent Prefetching
  private setupPrefetching() {
    // Prefetch links on hover (only on fast connections)
    if (this.connectionSpeed === 'fast') {
      document.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href]') as HTMLAnchorElement;
        
        if (link && !this.prefetchedUrls.has(link.href)) {
          this.prefetchUrl(link.href);
        }
      }, { passive: true });
    }

    // Prefetch visible links
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.connectionSpeed !== 'slow') {
          const link = entry.target as HTMLAnchorElement;
          this.prefetchUrl(link.href);
        }
      });
    }, { threshold: 0.5 });

    // Observe navigation links
    setTimeout(() => {
      document.querySelectorAll('nav a[href^="/"]').forEach(link => {
        linkObserver.observe(link);
      });
    }, 2000);
  }

  // 📡 Prefetch URL
  private prefetchUrl(url: string) {
    if (this.prefetchedUrls.has(url) || url.startsWith('#')) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    this.prefetchedUrls.add(url);
  }

  // 🎨 Optimize Animations (reduce on slow connections)
  public getAnimationConfig() {
    return {
      reducedMotion: this.connectionSpeed === 'slow',
      duration: this.connectionSpeed === 'slow' ? 0.2 : 0.5,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  }

  // 📊 Get current optimization status
  public getStatus() {
    return {
      connectionSpeed: this.connectionSpeed,
      cachedImages: this.imageCache.size,
      prefetchedUrls: this.prefetchedUrls.size,
      memoryUsage: 'memory' in performance 
        ? Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.jsHeapSizeLimit) * 100)
        : 0
    };
  }

  // 🔄 Manual optimization trigger
  public optimize() {
    this.observeLazyImages();
    this.detectConnectionSpeed();
  }

  // 🧹 Cleanup
  public destroy() {
    this.observer?.disconnect();
    this.imageCache.clear();
    this.prefetchedUrls.clear();
  }
}

// 🎯 Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PerformanceOptimizer.getInstance();
  });
}

export default PerformanceOptimizer;