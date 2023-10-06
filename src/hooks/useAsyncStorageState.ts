import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorageState<T>(
  key: string,
  initialState: T | (() => T),
) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(storageState => {
        if (storageState) {
          setState(JSON.parse(storageState));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [key]);

  useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(state)).catch(console.error);
  }, [key, state]);

  return [state, setState, isLoading] as const;
}
