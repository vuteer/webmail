import { useEffect } from 'react';

// Custom useEffect-like hook
export const useCustomEffect = (callback: () => void, dependencies: any[], cleanUp?: () => void) => {
  useEffect(() => {
    // Your custom logic goes here
    callback();

    // Cleanup function (if needed)
    // return () => {
      // Cleanup logic (if needed)
    if (cleanUp) return cleanUp()
    // };
  }, dependencies);
};