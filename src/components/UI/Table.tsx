import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/storeCofig";
import { TOWS_PER_PAGE } from "../types/Constants";
import { tableConfig } from "../types/Config";
import SparkLine from "../reusable/SparkLine";
import { useDispatch } from "react-redux";
import { updateHoldings, removeCoin } from "../store/tokenSlice";
export const Table: React.FC = () => {
  const dispatch = useDispatch();
  const tokens = useSelector((state: RootState) => state.tokens.tokens);

  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tokens.length / TOWS_PER_PAGE);
  const startIdx = (currentPage - 1) * TOWS_PER_PAGE;
  const endIdx = startIdx + TOWS_PER_PAGE;
  const currentRows = tokens.slice(startIdx, endIdx);

  const handleEdit = (row: any) => {
    setEditRowId(row.id);
    setEditValue(row.Holdings);
    setOpenMenuId(null);
  };

 const handleSave = (id: string) => {
   dispatch(updateHoldings({ id, holdings: editValue }));
   setEditRowId(null);
 };

 const handleRemove = (id: string) => {
   dispatch(removeCoin(id));
   setOpenMenuId(null);
 };


  return (
    <div className="md:mx-5 pb-6 text-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-2 border-tertiary">
          <thead className="bg-tertiary text-fontTertiary">
            <tr>
              {tableConfig?.headers.map((col) => (
                <th key={col.key} className="p-3 text-sm font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-800 hover:bg-tertiary/50"
                >
                  {/* Token column */}
                  <td className="p-3">
                    <div className="flex text-xs md:text-lg font-light flex-row items-center gap-2">
                      <img src={row.image} alt={row.name} className="w-6 h-6" />
                      {row.name} <span className="text-fontTertiary">({row.symbol?.toUpperCase()})</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-3 text-fontTertiary">${row.price_24h}</td>

                  {/* 24h % change */}
                  <td
                    className={`p-3 ${
                      row.ath_change_percentage && row.ath_change_percentage < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {row.ath_change_percentage?.toFixed(2)}%
                  </td>

                  {/* Sparkline placeholder */}
                  <td className="p-3">
                    <SparkLine data={row.Sparkline} className="w-5 h-6" />
                  </td>

                  {/* Editable Holdings */}
                  <td className="p-3">
                    {editRowId === row.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 h-8 text-sm bg-neutral-800 text-fontPrimary border border-bottonColor rounded px-2 focus:border-bottonColor focus:ring-1 focus:ring-bottonColor/40 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSave(row.id)}
                          className="bg-bottonColor text-fontSecondary hover:bg-bottonColor/80 border border-green-600/50 text-sm px-3 py-1 rounded hover:cursor-pointer transition"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      row.Holdings
                    )}
                  </td>

                  {/* Value */}
                  <td className="p-3">{row.Value}</td>

                  {/* Actions */}
                  <td className="p-3 relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === row.id ? null : row.id)
                      }
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === row.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(row)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-800"
                        >
                          ✏️ Edit Holdings
                        </button>
                        <button
                          onClick={() => handleRemove(row.id)}
                          className="w-full flex flex-row gap-2 items-center text-left px-3 py-2 text-sm text-red-500 hover:bg-red-600/20"
                        >
                          <Trash2 /> Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableConfig.headers.length}
                  className="p-10 text-center text-fontTertiary"
                  style={{ height: "200px" }}
                >
                  No token selected.{" "}
                  <span className="text-fontTertiary">Add token</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-tertiary text-fontTertiary text-sm">
        <span>
          {startIdx + 1} — {Math.min(endIdx, tokens.length)} of {tokens.length}{" "}
          results
        </span>
        <div className="flex gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`${
              currentPage === 1
                ? "text-fontTertiary cursor-not-allowed"
                : "hover:text-white"
            }`}
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`${
              currentPage === totalPages
                ? "text-fontTertiary cursor-not-allowed"
                : "hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
