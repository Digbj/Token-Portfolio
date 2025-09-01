import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useCoinDetails";
import type { Coin, ChartData } from "../types/Types";
import { neonColors } from "../types/Constants";
import { CACHE_DURATION, CACHE_KEY } from "../types/Constants";
import { DonutChart } from "../reusable/DonutChart";
import { useSelector } from "react-redux";
import type { RootState } from "../store/storeCofig";

export const Statics: React.FC = () => {
  const [coinDetails, setCoinDetails] = useState<ChartData[]>([]);
  const [shouldFetchApi, setShouldFetchApi] = useState(false);
  const totalValue = useSelector((state: RootState) => state.tokens.totalValue);
  // Check localStorage on component mount
  useEffect(() => {
    const checkCache = () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          // Check if cache is still valid (not expired)
          if (now - timestamp < CACHE_DURATION) {
            // Use cached data
            const details = data.map((coin: Coin, idx: number) => ({
              id: coin.id,
              image: coin.image,
              name: coin.name,
              value: Math.floor(Math.abs(coin?.ath_change_percentage ?? 0)),
              color: neonColors[idx % neonColors.length],
            }));
            setCoinDetails(details);
            // console.log("Using cached coin data");
            return;
          } else {
            // Cache expired, remove it
            localStorage.removeItem(CACHE_KEY);
          }
        }

        // No valid cache found, fetch from API
        setShouldFetchApi(true);
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        setShouldFetchApi(true);
      }
    };

    checkCache();
  }, []);

  // Conditionally call the API only if needed
  const {
    data: coins,
  } = useApi<Coin[]>(
    shouldFetchApi ? "/coins/markets?vs_currency=usd&per_page=6":""
  );

  // Handle API response and cache it
  useEffect(() => {
    if (coins && coins.length > 0) {
      try {
        // Cache the API response
        const cacheData = {
          data: coins,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        // Process the data for the component
        const details = coins.map((coin, idx) => ({
          id: coin.id,
          image: coin.image,
          name: coin.name,
          value: Math.floor(Math.abs(coin?.ath_change_percentage ?? 0)),
          color: neonColors[idx % neonColors.length],
        }));
        setCoinDetails(details);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        // Still process the data even if caching fails
        const details = coins.map((coin, idx) => ({
          id: coin.id,
          image: coin.image,
          name: coin.name,
          value: Math.floor(Math.abs(coin?.ath_change_percentage ?? 0)),
          color: neonColors[idx % neonColors.length],
        }));
        setCoinDetails(details);
      }
    }
  }, [coins]);

  // console.log(coinDetails);

  return (
    <div className=" md:mx-5 my-6 bg-tertiary md:rounded-xl flex flex-col md:flex-row item-start md:items-center justify-between p-5 gap-5">
      <div className="w-1/2 flex flex-col justify-between h-auto md:h-[240px]">
        <div className="flex flex-col gap-5 mb-4">
          <p className="font-medium text-sm text-fontTertiary leading-5">
            Portfolio Total
          </p>
          <p className="font-medium text-5xl text-fontPrimary">${totalValue}</p>
        </div>

        <p className="font-medium text-sm text-fontTertiary">
          Last updated: 3:42:12 PM
        </p>
      </div>
      <div className="md:h-[240px] w-full md:w-1/2">
        <p className="font-medium text-sm text-fontTertiary leading-5">
          Portfolio Total
        </p>
        <div className="flex flex-col md:flex-row item-center">
          <div className="w-full md:w-2/3">
            <DonutChart data={coinDetails} />
          </div>
          <div className="w-full">
            {coinDetails.map((coin) => (
              <div
                key={coin?.id}
                className="flex flex-row items-center justify-between my-2.5"
              >
                <div className="flex flex-row items-center gap-4">
                  <p
                    className="text-medium font-light"
                    style={{ color: coin.color }}
                  >
                    {coin.name}
                  </p>
                </div>

                <p className="font-medium text-sm text-fontPrimary">
                  {coin.value}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};