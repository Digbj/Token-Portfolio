import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApiOptions extends Omit<AxiosRequestConfig, "headers"> {
  enabled?: boolean; 
  headers?: Record<string, string>;
}

// Base configuration
// const BASE_URL = "https://api.coingecko.com/api/v3";
const BASE_URL = import.meta.env.VITE_COINGECKO_BASE_URL;
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const DEFAULT_HEADERS = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};

export const useApi = <T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true, headers = {}, ...axiosConfig } = options;

  // Combine default headers with custom headers
  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const fullUrl = endpoint.startsWith("http")
        ? endpoint
        : `${BASE_URL}${endpoint}`;

      const response = await axios.get<T>(fullUrl, {
        ...axiosConfig,
        headers: mergedHeaders,
      });

      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "An error occurred");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && endpoint) {
      fetchData();
    }
  }, [endpoint, enabled]);

  const refetch = () => {
    if (endpoint) {
      fetchData();
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};