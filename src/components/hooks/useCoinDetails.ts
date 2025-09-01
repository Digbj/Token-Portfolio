// import { useEffect, useState, useCallback } from "react";
// import axios, { AxiosError } from "axios";
// import type { CancelTokenSource } from "axios";

// interface ApiResponse<T> {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// }

// const BASE_URL = import.meta.env.VITE_COINGECKO_BASE_URL;
// const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// export function useCoinDetails<T>(
//   endpoint: string,
//   options: {
//     page?: number;
//     per_page?: number;
//     //extra params
//     [key: string]: any;
//   } = {}
// ): ApiResponse<T> {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const source: CancelTokenSource = axios.CancelToken.source();
//     try {
//       const res = await axios.get<T>(`${BASE_URL}${endpoint}`, {
//         params: options,
//         headers: {
//           accept: "application/json",
//           ...(API_KEY ? { "x-cg-pro-api-key": API_KEY } : {}),
//         },
//         cancelToken: source.token,
//       });
//       setData(res.data);
//     } catch (err) {
//       if (axios.isCancel(err)) return;
//       const axiosError = err as AxiosError;
//       setError((axiosError.response?.data as string) || axiosError.message);
//     } finally {
//       setLoading(false);
//     }

//     return () => source.cancel("Request canceled");
//   }, [endpoint, JSON.stringify(options)]); // stringifying here is fine since useCallback won't recreate on every render

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch: fetchData };
// }




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
  enabled?: boolean; // Allow disabling auto-fetch
  headers?: Record<string, string>; // Additional headers to merge with defaults
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