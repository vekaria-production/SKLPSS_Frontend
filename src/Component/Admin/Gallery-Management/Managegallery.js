import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import events from "../../../assets/eventsarray";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import axios from "axios";

async function getEventsData({  offset = 0, limit = 100 } = {}) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
      params: {  offset, limit },
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
    title: true,
    date: true,
    type: true,
    status: true,
  });
  const now = new Date();
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    fromDate: "",
    toDate: "",
  });

  async function fetchEvents() {
    const result = await getEventsData();
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

    // // console.log(updatedEvents)
    setEventData(updatedEvents)
  }

  useEffect(() => {
    fetchEvents();
  }, [])
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
      if (
        showFilters &&
        filtersRef.current &&
        !filtersRef.current.contains(e.target)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings, showFilters]);

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
  const filteredEvents = eventData.filter( (event) => {
    // Case-insensitive search on Name (not title)
    const matchName = event.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Assuming filters.status and filters.type are still relevant and event has those properties
    const matchStatus = filters.status ? event.status === filters.status : true;
    const matchType = filters.type ? event.type === filters.type : true;

    // Using 'From' and 'To' date fields for filtering date range
    const eventFrom = new Date(event.From);
    const eventTo = new Date(event.To);

    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    // Check if event's date range overlaps with filter date range
    // For example, event is valid if its period intersects the filter range
    const matchDate = (
      (!fromDate || eventTo >= fromDate) && 
      (!toDate || eventFrom <= toDate)
    );

    return matchName && matchStatus && matchType && matchDate;
  });

  const statusOptions = [...new Set(events.map((e) => e.status))];
  const typeOptions = [...new Set(events.map((e) => e.type))];

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Gallery Management</h1>
        </div>

        {/* Search and Icon Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-300 w-full sm:max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Event Name"
              className="outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 self-end sm:self-auto">
            {/* Filter */}
            <div className="relative" ref={filtersRef}>
              <FaFilter
                className="text-[#F48F0F] text-xl cursor-pointer hover:opacity-70"
                onClick={() => setShowFilters((prev) => !prev)}
              />
              {showFilters && (
                <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-4 z-20 w-72 max-w-[90vw] border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border px-2 py-1 rounded text-sm"
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Range
                    </label>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded text-sm mb-1"
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                      }
                    />
                    <h2 className="text-center text-sm">to</h2>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded text-sm"
                      value={filters.toDate}
                      onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border px-2 py-1 rounded text-sm"
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      {typeOptions.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Column Settings */}
            <div className="relative" ref={settingsRef}>
              <FaCog
                className="text-[#F48F0F] text-xl cursor-pointer hover:opacity-70"
                onClick={() => setShowSettings((prev) => !prev)}
              />
              {showSettings && (
                <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-4 z-20 border border-gray-200">
                  {Object.keys(visibleCols).map((key) => (
                    <label key={key} className="block text-sm mb-2">
                      <input
                        type="checkbox"
                        checked={visibleCols[key]}
                        onChange={() =>
                          setVisibleCols({
                            ...visibleCols,
                            [key]: !visibleCols[key],
                          })
                        }
                        className="mr-2"
                      />
                      Show {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Table */}
        <CustomTable
          cols={[
            { key: "Name", label: "Event Name" },
            { key: "FormattedFromTime", label: "From" },
            { key: "FormattedToTime", label: "To" },
            { key: "Status", label: "Status" },
          ]}
          rows={filteredEvents.map((event) => ({
            ...event,
            actions: (
              <>
                <FaEdit
                  className="text-[#F48F0F] cursor-pointer"
                  onClick={() =>
                    navigate(`/Admin/Edit-Gallery/${event.ID}`, {state : {event}})
                  }
                />
                {/* <FaTrash
                  className="text-[#F48F0F] cursor-pointer ml-4"
                  onClick={() => confirmDelete(event.ID)}
                /> */}
              </>
            ),
          }))}
          visibleCols={visibleCols}
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
