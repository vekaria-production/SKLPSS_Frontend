import React from "react";

const DocumentFilters = ({ filters, setFilters, onClose }) => {
  return (
    <div className="absolute top-8 right-0 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-20">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Type"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />

        <button
          className="text-sm text-gray-500 self-end"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DocumentFilters;
