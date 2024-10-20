import { useState, useCallback, useMemo } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: () => Promise<void>;
}

const useFetchApi = <T>(
  url: string,
  options?: AxiosRequestConfig
): ApiState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the fetchData function using useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<T> = await axios(url, options);
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({ data, loading, error, fetchData }),
    [data, loading, error, fetchData]
  );
};

export default useFetchApi;
