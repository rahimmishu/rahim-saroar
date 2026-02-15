import { useState, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────
// Anonymous User ID — Sign-in ছাড়াই identification
// ─────────────────────────────────────────────
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('rsm_anonymous_uid');
  if (!userId) {
    const random = Math.random().toString(36).substr(2, 12);
    userId = `user_${random}_${Date.now()}`;
    localStorage.setItem('rsm_anonymous_uid', userId);
    console.log('[CloudState] New anonymous user created:', userId.slice(0, 20) + '...');
  }
  return userId;
};

// ─────────────────────────────────────────────
// Cloud Save — Background এ save হয়, error হলে silent fail
// ─────────────────────────────────────────────
const saveToCloud = async (userId: string, stateKey: string, value: unknown): Promise<void> => {
  const cloudKey = `${userId}:${stateKey}`;
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cloudKey, value }),
    });
    if (!res.ok) {
      console.warn('[CloudState] Cloud save failed, using localStorage only');
    }
  } catch {
    // Offline বা network error — localStorage backup হিসেবে আছে
    console.warn('[CloudState] Network error, data saved to localStorage only');
  }
};

// ─────────────────────────────────────────────
// Cloud Load — Cloud থেকে latest data আনো
// ─────────────────────────────────────────────
const loadFromCloud = async (userId: string, stateKey: string): Promise<unknown> => {
  const cloudKey = `${userId}:${stateKey}`;
  try {
    const res = await fetch(`/api/load?key=${encodeURIComponent(cloudKey)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────
// Main Hook: useCloudState<T>
//
// Usage:
//   const [state, setState, isSynced] = useCloudState('music_player', defaultValue);
//
// - isSynced: true মানে cloud থেকে data load হয়ে গেছে, এখন resume করতে পারো
// ─────────────────────────────────────────────
export function useCloudState<T>(
  stateKey: string,
  defaultValue: T
): [T, (newValue: T | ((prev: T) => T)) => void, boolean] {
  const localCacheKey = `rsm_cache_${stateKey}`;

  // localStorage থেকে instant load (flicker নেই)
  const [state, setState] = useState<T>(() => {
    try {
      const cached = localStorage.getItem(localCacheKey);
      return cached ? JSON.parse(cached) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const [isSynced, setIsSynced] = useState(false);
  const userIdRef = useRef<string>('');

  // Mount এ user ID নাও এবং cloud থেকে data load করো
  useEffect(() => {
    userIdRef.current = getOrCreateUserId();

    loadFromCloud(userIdRef.current, stateKey).then((cloudValue) => {
      if (cloudValue !== null && cloudValue !== undefined) {
        setState(cloudValue as T);
        localStorage.setItem(localCacheKey, JSON.stringify(cloudValue));
      }
      setIsSynced(true);
    });
  }, [stateKey, localCacheKey]);

  // State update করো — localStorage + Cloud দুটোতেই
  const updateState = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue;

        // Instant localStorage save
        localStorage.setItem(localCacheKey, JSON.stringify(resolved));

        // Background cloud save
        if (userIdRef.current) {
          saveToCloud(userIdRef.current, stateKey, resolved);
        }

        return resolved;
      });
    },
    [stateKey, localCacheKey]
  );

  return [state, updateState, isSynced];
}

// ─────────────────────────────────────────────
// Utility: Debounced Cloud State
// Position-tracking এর মতো frequent update এর জন্য
// (যেমন: song position প্রতি সেকেন্ডে save না করে 5 সেকেন্ড পরপর)
// ─────────────────────────────────────────────
export function useCloudStateDebounced<T>(
  stateKey: string,
  defaultValue: T,
  debounceMs: number = 3000
): [T, (newValue: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState, isSynced] = useCloudState(stateKey, defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localCacheKey = `rsm_cache_${stateKey}`;
  const userIdRef = useRef<string>(getOrCreateUserId());

  const debouncedUpdate = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue;

        // localStorage এ instant save (fast)
        localStorage.setItem(localCacheKey, JSON.stringify(resolved));

        // Cloud save debounce করো
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          saveToCloud(userIdRef.current, stateKey, resolved);
        }, debounceMs);

        return resolved;
      });
    },
    [setState, stateKey, localCacheKey, debounceMs]
  );

  return [state, debouncedUpdate, isSynced];
}