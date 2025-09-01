import { RefreshCw, Star } from "lucide-react";
import React, { useState } from "react";
import { AddTokenModal } from "./TokenModel";
import { Table } from "./Table";
export const DataTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AddToken = () => {
    setIsModalOpen(true);
  };

  const RefreshButtonClicked = () => {
    console.log("Refresh button clicked");
  };

  return (
    <>
    <div className="mt-6 rounded-xl flex flex-row sm:items-center justify-between p-5 gap-5">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-2">
        <Star className="text-bottonColor fill-bottonColor w-5 h-5 md:w-6 md:h-6" />
        <span className="text-xl md:text-2xl font-semibold text-fontPrimary">
          Watchlist
        </span>
      </div>

      {/* Right Section (Buttons) */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={RefreshButtonClicked}
          className="px-4 py-2 rounded-lg bg-tertiary text-sm font-medium text-fontTertiary flex items-center hover:bg-tertiary/70 transition hover:cursor-pointer"
        >
          <RefreshCw size={16} />
          <span className="ml-2 hidden sm:inline">Refresh Prices</span>
        </button>
        <button
          onClick={AddToken}
          className="px-4 py-2 rounded-lg bg-bottonColor text-medium font-medium text-fontSecondary hover:bg-bottonColor/80 transition hover:cursor-pointer"
        >
          + Add Token
        </button>
      </div>

      
      {/* Modal */}
      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
    <Table/>
    </>
  );
};
