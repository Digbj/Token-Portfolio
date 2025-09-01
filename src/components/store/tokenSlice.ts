import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Coin } from "../types/Types";

interface TokenState {
  tokens: Coin[];
  totalValue: number;
}

// 🔹 Helper: calculate total value
const calculateTotalValue = (tokens: Coin[]) => {
  return tokens.reduce((sum, token) => {
    const value = parseFloat(token.Value || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
};

// 🔹 Load state from localStorage
const loadState = (): TokenState => {
  try {
    const saved = localStorage.getItem("tokens");
    if (saved) {
      const tokens: Coin[] = JSON.parse(saved);
      return {
        tokens,
        totalValue: calculateTotalValue(tokens),
      };
    }
  } catch (error) {
    console.error("Failed to load tokens from localStorage", error);
  }
  return { tokens: [], totalValue: 0 };
};

// 🔹 Save state to localStorage
const saveState = (tokens: Coin[]) => {
  try {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  } catch (error) {
    console.error("Failed to save tokens to localStorage", error);
  }
};

// Initial state
const initialState: TokenState = loadState();

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<Coin[]>) => {
      const newTokens = action.payload.filter(
        (newToken) => !state.tokens.some((t) => t.id === newToken.id)
      );
      state.tokens.push(...newTokens);

      state.totalValue = calculateTotalValue(state.tokens);
      saveState(state.tokens); // 🔥 persist
    },
    removeCoin: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter(
        (token) => token.id !== action.payload
      );

      state.totalValue = calculateTotalValue(state.tokens);
      saveState(state.tokens); // 🔥 persist
    },
    updateHoldings: (
      state,
      action: PayloadAction<{ id: string; holdings: string }>
    ) => {
      const { id, holdings } = action.payload;
      const token = state.tokens.find((t) => t.id === id);
      if (token) {
        token.Holdings = holdings;
        token.Value = (
          parseFloat(holdings) * parseFloat(token.price_24h)
        ).toString();
      }

      state.totalValue = calculateTotalValue(state.tokens);
      saveState(state.tokens); // 🔥 persist
    },
    clearCoins: (state) => {
      state.tokens = [];
      state.totalValue = 0;
      saveState(state.tokens);
    },
  },
});

export const { addCoin, removeCoin, updateHoldings, clearCoins } =
  tokenSlice.actions;
export default tokenSlice.reducer;
