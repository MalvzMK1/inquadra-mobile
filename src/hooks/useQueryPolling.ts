import { useEffect } from "react";
import { useInternetConnectionContext } from "../context/InternetConnectionContext";

export function useQueryPolling(
  pollingTimeInMilliseconds: number,
  startPolling: (pollInterval: number) => void,
  stopPolling: () => void,
) {
  const { isConnected } = useInternetConnectionContext();

  useEffect(() => {
    if (!isConnected) return;

    startPolling(pollingTimeInMilliseconds);

    return () => {
      stopPolling();
    };
  }, [isConnected, startPolling, pollingTimeInMilliseconds, stopPolling]);
}
