import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMilliseconds: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMilliseconds);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delayMilliseconds]);

  return debouncedValue;
}
