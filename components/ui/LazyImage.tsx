import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  placeholderColor?: string;
  priority?: boolean; // true হলে lazy load হবে না (hero image-এর জন্য)
  onLoad?: () => void;
}

/**
 * LazyImage — Intersection Observer দিয়ে image lazy load করে।
 * 
 * Usage:
 *   <LazyImage src="/public/banner.jpg" alt="Banner" className="w-full" />
 * 
 *   Hero image-এর জন্য priority={true} দাও — সেগুলো সাথে সাথে load হবে:
 *   <LazyImage src="/public/rahim-saroar-mishu-profile.jpg" alt="Profile" priority />
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  style,
  width,
  height,
  placeholderColor = '#1a1a2e',
  priority = false,
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // priority হলে শুরু থেকেই true
  const [hasError, setHasError] = useState(false);
  // ✅ Type ref to support both div (for observer) and img (for direct load)
  const imgRef = useRef<HTMLDivElement | HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // priority image-এ observer লাগবে না

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Viewport-এর 200px আগেই load শুরু হবে
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={!priority ? (imgRef as React.RefObject<HTMLDivElement>) : undefined}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isLoaded ? 'transparent' : placeholderColor,
        width,
        height,
        ...style,
      }}
    >
      {/* Shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${placeholderColor} 25%, rgba(255,255,255,0.08) 50%, ${placeholderColor} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Actual image — isInView true হলেই src set হবে */}
      {isInView && !hasError && (
        <img
          ref={priority ? (imgRef as React.RefObject<HTMLImageElement>) : undefined}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'block',
          }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
          }}
        >
          Image not found
        </div>
      )}

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
