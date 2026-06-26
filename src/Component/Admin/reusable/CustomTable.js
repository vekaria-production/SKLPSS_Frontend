import React from "react";

const CustomTable = ({ cols, rows, visibleCols = {}, filterRow, showFiltersRow, onToggleFilters }) => {
  const getVisible = (key) => visibleCols[key] ?? true;
  const visibleColKeys = cols.filter((col) => getVisible(col.key));

  return (
    <div className="border border-gray-200 rounded-xl w-full overflow-hidden">
      <div className="overflow-auto max-h-[60vh]">
        <table className="min-w-max w-full border-collapse table-fixed">
          {/* Sticky Header */}
          <thead className="bg-[#E1D5C9] text-[#292929] text-sm sticky top-0 z-10">
            <tr>
              {visibleColKeys.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left whitespace-nowrap w-[200px] bg-[#E1D5C9]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.filterable && onToggleFilters && (
                      <button
                        onClick={onToggleFilters}
                        className="text-[#F48F0F] hover:opacity-80 focus:outline-none text-[10px] transition-all font-semibold ml-1"
                        title="Toggle Filters"
                      >
                        {showFiltersRow ? "▲" : "▼"}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left whitespace-nowrap w-[150px] bg-[#E1D5C9]">
                Actions
              </th>
            </tr>
            {filterRow && (
              <tr className="bg-[#EDE4DC] border-t border-[#E1D5C9]">
                {visibleColKeys.map((col, i) => (
                  <th key={i} className="px-4 py-2 w-[200px] bg-[#EDE4DC] font-normal">
                    {filterRow(col)}
                  </th>
                ))}
                <th className="px-4 py-2 w-[150px] bg-[#EDE4DC] text-left font-normal">
                  {filterRow({ key: "actions" })}
                </th>
              </tr>
            )}
          </thead>

          {/* Table Body */}
          <tbody>
            {rows.map((row, rIndex) => (
              <tr
                key={rIndex}
                className={`${
                  rIndex % 2 === 0 ? "bg-white" : "bg-[#F5EFEB]"
                } text-[#292929] text-sm`}
              >
                {visibleColKeys.map((col, cIndex) => (
                  <td
                    key={cIndex}
                    className="px-4 py-3 whitespace-nowrap w-[200px]"
                  >
                    
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap w-[150px]">
                  <div className="flex gap-3">
                    {row.actions || <span className="text-gray-400">—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
