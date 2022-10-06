import { useEffect, useRef } from "react";

//mb this better https://pgarciacamou.medium.com/react-simple-polling-custom-hook-usepollingeffect-1e9b6b8c9c71
export function useInterval(callback: () => any, delay: number | undefined) {
    const savedCallback = useRef<() => any>(() => { });
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }