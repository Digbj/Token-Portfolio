import { Wallet } from "lucide-react";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const NavBar: React.FC = () => {
  return (
    <nav className="flex flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center gap-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="8" fill="#A9E851" />
          <path d="M6 6L19 9.5L22 22H6V6Z" fill="#18181B" />
        </svg>
        <p className="text-lg md:text-xl font-semibold">Token Portfolio</p>
      </div>

      <div>
        {/* Custom styled wallet button using RainbowKit */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="flex items-center h-8 px-4 rounded-full bg-bottonColor text-sm font-medium text-fontSecondary hover:opacity-80 transition-opacity"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        <span>Connect Wallet</span>
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        className="flex items-center h-8 px-4 rounded-full bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <button
                      onClick={openAccountModal}
                      className="flex items-center h-8 px-4 rounded-full bg-bottonColor text-sm font-medium text-fontSecondary hover:opacity-80 transition-opacity"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      <span>
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </span>
                    </button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
};