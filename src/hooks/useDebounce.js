import { useCallback, useEffect, useRef } from "react";

const useDebounce = (delay = 500, callback) => {
  const timeoutId = useRef(null);

  const debouncedFn = useCallback(
    function (...args) {
      timeoutId.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (!timeoutId) return;
      clearTimeout(timeoutId.current);
    };
  }, [callback, delay]);

  return debouncedFn;
};

export default useDebounce;
