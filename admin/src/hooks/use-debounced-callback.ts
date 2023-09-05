import { useRef, useCallback } from "react";

type DebouncedFunction<T extends any[]> = (...args: T) => void;

export const useDebouncedCallback = <T extends any[]>(
  func: DebouncedFunction<T>,
  delay: number
) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: T) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, delay);
    },
    [func, delay]
  );
};
