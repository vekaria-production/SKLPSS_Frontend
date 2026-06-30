import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import events from "../../../assets/eventsarray";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import axios from "axios";
import useDebounce from "../../../hooks/useDebounce";

async function getEventsData({ offset = 0, limit = 100, search, category, status, fromDate, toDate } = {}) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
      params: { 
        offset, 
        limit, 
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        from_date: fromDate ? new Date(fromDate).toISOString() : undefined,
        to_date: toDate ? new Date(toDate).toISOString() : undefined
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    let data = response.data;
    if (typeof data === 'string') data = JSON.parse(data);
    return data;
  } catch (error) {
    return null;
  }
}

const ManageEvents = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCols, setVisibleCols] = useState({
    Name: true,
    FormattedFromTime: true,
    FormattedToTime: true,
    Status: true,
  });
  const now = new Date();
  const [showSettings, setShowSettings] = useState(false);
  const [showFiltersRow, setShowFiltersRow] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    fromDate: "",
    toDate: "",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  async function fetchEvents(searchVal = debouncedSearchTerm, filterOpts = filters) {
    const result = await getEventsData({
      search: searchVal,
      category: filterOpts.category,
      status: filterOpts.status,
      fromDate: filterOpts.fromDate,
      toDate: filterOpts.toDate,
    });
    if (!result || !result.events) return;
    const updatedEvents = result.events.map(event => {
      const fromDate = new Date(event.From);
      const toDate = new Date(event.To);
      let status = '';

      if (fromDate > now) {
        status = 'upcoming';
      } else if (toDate >= now) {
        status = 'ongoing';
      } else {
        status = 'completed';
      }

      const formattedFromTime = fromDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const formattedToTime = toDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      return {
        ...event,
        Status: status,
        FormattedFromTime: formattedFromTime,
        FormattedToTime: formattedToTime
      };
    });

    setEventData(updatedEvents)
  }

  useEffect(() => {
    fetchEvents(debouncedSearchTerm, filters);
  }, [debouncedSearchTerm, filters.category, filters.status, filters.fromDate, filters.toDate]);
  const [deleteId, setDeleteId] = useState(null);
  const settingsRef = useRef();
  const filtersRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(e.target)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  async function deleteEvent(ID) {

    try {
      await axios.delete(`${process.env.REACT_APP_NETWORK}/deleteEvent/${ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // let data = response.data;
      // if (typeof data === 'string') {
      //   data = JSON.parse(data);
      // }
      // // console.log("Fetched API data:", data);
      // return data;
    } catch (error) {
      console.info("Reload");
      return null;


    }
  }

  const handleDeleteConfirmed = () => {
    // // console.log(deleteId)
    deleteEvent(deleteId)
    // // console.log(eventData)
    setEventData((prev) => prev.filter((e) => e.ID !== deleteId));
    // // console.log(eventData)
    setDeleteId(null);
  };
  const filteredEvents = eventData;

  const statusOptions = ["upcoming", "ongoing", "completed"];
  const categoryOptions = ["General", "Religious", "Cultural", "Sports", "Education"];

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 min-h-[550px] relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Gallery Management</h1>
        </div>

        {/* Settings */}
        <div className="flex justify-end mb-4 relative">
          <div className="relative" ref={settingsRef}>
            <FaCog
              className="text-[#F48F0F] text-xl cursor-pointer hover:opacity-70 transition-transform hover:rotate-45 duration-300"
              onClick={() => setShowSettings((prev) => !prev)}
            />
            {showSettings && (
              <div className="absolute top-10 right-0 w-60 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 z-30 border border-gray-100 transition-all duration-200 ease-out origin-top-right">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 pb-1.5 border-b border-gray-100">
                  Visible Columns
                </div>
                <div className="space-y-1.5">
                  {Object.keys(visibleCols).map((key) => {
                    const labels = {
                      Name: "Event Name",
                      FormattedFromTime: "From",
                      FormattedToTime: "To",
                      Status: "Status",
                    };
                    return (
                      <div
                        key={key}
                        onClick={() =>
                          setVisibleCols({
                            ...visibleCols,
                            [key]: !visibleCols[key],
                          })
                        }
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F48F0F]/10 cursor-pointer transition-all duration-150 group"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#F48F0F] transition-colors duration-150 select-none">
                          {labels[key] || key}
                        </span>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                            visibleCols[key] ? "bg-[#F48F0F]" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out transform ${
                              visibleCols[key] ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Table */}
        <CustomTable
          cols={[
            { key: "Name", label: "Event Name", filterable: true },
            { key: "FormattedFromTime", label: "From", filterable: true },
            { key: "FormattedToTime", label: "To", filterable: true },
            { key: "Status", label: "Status", filterable: true },
          ]}
          rows={filteredEvents.map((event) => ({
            ...event,
            actions: (
              <>
                <FaEdit
                  size={18}
                  className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(`/Admin/Edit-Gallery/${event.ID}`, { state: { event } })
                  }
                />
              </>
            ),
          }))}
          visibleCols={visibleCols}
          showFiltersRow={showFiltersRow}
          onToggleFilters={() => setShowFiltersRow(!showFiltersRow)}
          filterRow={showFiltersRow ? (col) => {
            if (col.key === "Name") {
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
            if (col.key === "FormattedFromTime") {
              return (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs font-normal bg-white"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                />
              );
            }
            if (col.key === "FormattedToTime") {
              return (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs font-normal bg-white"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                />
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
              if (filters.status || filters.fromDate || filters.toDate || searchTerm) {
                return (
                  <button
                    onClick={() => {
                      setFilters({ status: "", category: "", fromDate: "", toDate: "" });
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

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <DeleteConfirmation
            onCancel={cancelDelete}
            onConfirm={handleDeleteConfirmed}
            title="Delete Event"
            message="Are you sure you want to delete this event?"
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageEvents;
