// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// b98f2fc3-2d7e-4766-bfe9-55ce0fc40d92

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { WagmiProvider, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";

// Get environment variables
const projectId = import.meta.env.VITE_TOKEN_ID; // Should be your WalletConnect project ID
const appName = import.meta.env.VITE_APP_NAME || "Your App Name";

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure Wagmi with RainbowKit's getDefaultConfig
const config = getDefaultConfig({
  appName: appName,
  projectId: projectId,
  chains: [mainnet], // Add other chains like polygon, arbitrum if needed
  transports: {
    [mainnet.id]: http(),
  },
});

// Render the app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);