import { useEffect, useRef, useCallback } from 'react';

export function useAnimationFrame(callback: (deltaTime: number) => void, active: boolean = true) {
  const rafRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const animate = useCallback((time: number) => {
    const dt = previousTimeRef.current ? time - previousTimeRef.current : 0;
    previousTimeRef.current = time;
    callbackRef.current(dt);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (active) {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, animate]);
}
