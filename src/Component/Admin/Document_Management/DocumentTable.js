import React from "react";
import { FaTrash, FaDownload } from "react-icons/fa";
import CustomTable from "../reusable/CustomTable";

const DocumentTable = ({
  documents,
  onDelete,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFiltersRow,
  setShowFiltersRow,
}) => {
  const categoryOptions = [...new Set(documents.map((d) => d.Category).filter(Boolean))];
  const statusOptions = [...new Set(documents.map((d) => d.Status).filter(Boolean))];

  return (
    <CustomTable
      cols={[
        { key: "DocumentName", label: "Document Name", filterable: true },
        { key: "Category", label: "Category", filterable: true },
        // { key: "UploadedBy", label: "Uploaded By (ID)" },
        { key: "Status", label: "Status", filterable: true },
        { key: "CreatedAt", label: "Uploaded On" },
      ]}
      rows={documents.map((doc) => ({
        ...doc,
        Status: doc.Status,
        CreatedAt: new Date(doc.CreatedAt).toLocaleDateString(),
        actions: (
          <>
            <FaDownload
              size={18}
              className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer mr-3 transition-colors"
              onClick={() => window.open(doc.DocumentLink, "_blank")}
            />
            <FaTrash
              size={18}
              className="text-red-500 hover:text-red-600 cursor-pointer transition-colors"
              onClick={() => onDelete(doc)}
            />
          </>
        ),
      }))}
      showFiltersRow={showFiltersRow}
      onToggleFilters={() => setShowFiltersRow(!showFiltersRow)}
      filterRow={showFiltersRow ? (col) => {
        if (col.key === "DocumentName") {
          return (
            <input
              type="text"
              placeholder="Filter name..."
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          );
        }
        if (col.key === "Category") {
          return (
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All</option>
              {categoryOptions.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          );
        }
        if (col.key === "Status") {
          return (
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All</option>
              {statusOptions.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          );
        }
        if (col.key === "actions") {
          if (filters.category || filters.status || searchTerm) {
            return (
              <button
                onClick={() => {
                  setFilters({ category: "", status: "" });
                  setSearchTerm("");
                }}
                className="text-xs text-[#F48F0F] hover:underline font-semibold"
              >
                Clear
              </button>
            );
          }
        }
        return null;
      } : null}
    />
  );
};

export default DocumentTable;
