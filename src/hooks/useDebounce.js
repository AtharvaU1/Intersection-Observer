import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import useDependenciesDebugger from "./useDependenciesDebugger";

const useDebounce = (delay = 500, callback) => {
  const [time, setTime] = useState(Date.now());
  const timeoutId = useRef(null);

  const debouncedFn = useCallback(
    function (...args) {
      // put this inside useEffect!!
      timeoutId.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, time]
  );

  useEffect(() => {
    return () => {
      if (!timeoutId) return;
      clearTimeout(timeoutId.current);
    };
  }, [callback, delay, time]);
  //useDependenciesDebugger({ callback, delay, time });

  return debouncedFn;
};

export default useDebounce;
