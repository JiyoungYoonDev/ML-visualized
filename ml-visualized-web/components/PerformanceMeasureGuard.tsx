'use client';

import { useEffect } from 'react';

export default function PerformanceMeasureGuard() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof performance?.measure !== 'function'
    ) {
      return;
    }

    const originalMeasure = performance.measure.bind(performance);

    performance.measure = ((...args: any[]) => {
      try {
        return (originalMeasure as any).apply(performance, args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('negative time stamp')) {
          return undefined;
        }
        throw error;
      }
    }) as typeof performance.measure;

    return () => {
      performance.measure = originalMeasure;
    };
  }, []);

  return null;
}
