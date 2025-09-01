import { Star, Check } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useApi } from "../hooks/useCoinDetails";
import { useDispatch } from "react-redux";
import { addCoin } from "../store/tokenSlice";
import { generateSparklineData } from "../utils/sparkLine";
import type { Coin } from "../types/Types";
export const AddTokenModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { data: coins } = useApi<any[]>(
    isOpen ? "/coins/markets?vs_currency=usd&per_page=100" : ""
  );

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!coins) return [];

    if (!searchQuery.trim()) return coins;

    const query = searchQuery.toLowerCase();
    return coins.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
    );
  }, [coins, searchQuery]);

  // Toggle token selection
  const toggleSelection = (symbol: string) => {
    setSelectedTokens((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Handle add button click - return selected token objects
  const handleAddTokens = () => {
    if (!coins || selectedTokens.length === 0) return;
    const selectedTokenObjects: Coin[] = coins
      .filter((token) => selectedTokens.includes(token.symbol))
      .map((token) => ({
        id: token.id,
        image: token.image,
        name: token.name,
        symbol: token.symbol,
        price_24h: token.current_price.toString(),
        ath_change_percentage: token.price_change_percentage_24h,
        Sparkline: generateSparklineData(
          70,
          token.current_price * 0.9,
          token.current_price * 1.1
        ),
        Holdings: "0",
        Value: "0",
      }));

    dispatch(addCoin(selectedTokenObjects)); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/90 bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-modelBg h-[485px] w-[640px] rounded-lg shadow-xl relative border-2 border-tertiary flex flex-col overflow-hidden">
        {/* Header + Search */}
        <div>
          <input
            type="text"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            className="w-full p-4 rounded-t-lg border-b-2 bg-modelbg/85 border-b-tertiary text-fontPrimary placeholder:font-medium placeholder:text-medium placeholder:text-modelInputtext focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p className="px-4 py-3 text-modelInputtext font-medium text-sm">
            Trending
          </p>
        </div>

        {/* Token List (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {filteredCoins.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-fontTertiary py-4">
                Loading<span className="animate-pulse text-2xl">...</span>
              </p>
            </div>
          ) : (
            filteredCoins.map((token) => {
              const isSelected = selectedTokens.includes(token.symbol);
              return (
                <div
                  key={token.id}
                  onClick={() => toggleSelection(token.symbol)}
                  className={`flex flex-row items-center justify-between rounded-md gap-2 mx-2 px-2 py-3 cursor-pointer transition ${
                    isSelected ? "bg-bottonColor/5" : "hover:bg-tertiary/50"
                  }`}
                >
                  {/* Left section */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-8 h-8 bg-secondary/50 rounded-lg flex items-center justify-center text-lg">
                      <img
                        src={token.image}
                        alt={token.name}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className=" text-fontPrimary font-light">
                        {token.name} ({token.symbol.toUpperCase()})
                      </p>
                    </div>
                  </div>

                  {/* Right section: Star + Circular Checkbox */}
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <Star className="w-4 h-4 text-bottonColor fill-bottonColor" />
                    )}
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition ${
                        isSelected
                          ? "bg-bottonColor border-bottonColor"
                          : "border-fontTertiary/50 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-fontSecondary font-bold"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-tertiary border-t-white/10 flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded-lg text-fontTertiary border border-white/10 hover:bg-white/5 transition hover:cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={selectedTokens.length === 0}
            className={`px-4 py-2 rounded-lg border border-white/10 ${
              selectedTokens.length > 0
                ? "bg-bottonColor text-fontSecondary hover:bg-bottonColor/80"
                : "bg-tertiary text-fontTertiary cursor-not-allowed"
            }`}
            onClick={handleAddTokens}
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
};