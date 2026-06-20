'use client';

import { useState, useCallback, useRef } from 'react';

type OptimisticState<T> = [T, (update: T) => Promise<void>];

export function useOptimistic<T>(
  initialState: T,
): OptimisticState<T> {
  const [state, setState] = useState<T>(initialState);
  const rollbackRef = useRef<T>(initialState);

  const mutate = useCallback(async (update: T) => {
    rollbackRef.current = state;
    setState(update);
  }, [state]);

  return [state, mutate];
}

export function useOptimisticMap<T extends Record<string, unknown>>(
  initialMap: T,
) {
  const [map, setMap] = useState<T>(initialMap);
  const rollbackRef = useRef<T>(initialMap);

  const updateKey = useCallback(async (key: keyof T, value: T[keyof T]) => {
    rollbackRef.current = { ...map };
    setMap((prev) => ({ ...prev, [key]: value }));
  }, [map]);

  const rollback = useCallback(() => {
    setMap(rollbackRef.current);
  }, []);

  return { map, updateKey, rollback };
}
