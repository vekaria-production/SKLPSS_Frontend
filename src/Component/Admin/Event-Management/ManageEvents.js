import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";

import DeleteConfirmation from "../reusable/DeleteConfirmation";
import axios from "axios";


async function getEventsData({  offset = 0, limit = 100 } = {}) {
  try {
    const response = await axios.get(`http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/getEventList`, {
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
    category: true,
    status: true,
  });
  const now = new Date();
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    fromDate: "",
    toDate: "",
  });

  const [deleteId, setDeleteId] = useState(null);
  const settingsRef = useRef();
  const filtersRef = useRef();

  async function fetchEvents() {
    const result = await getEventsData();
    console.log(result, "EventsList")
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

  async function handleDeleteConfirmed () {

    try {
        await axios.delete(`http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/deleteEvent/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

    } catch (error) {
      console.info("Reload");
      return null;
    }    
    setDeleteId(false);
    fetchEvents();

  };

  const filteredEvents = eventData.filter( (event) => {
    // Case-insensitive search on Name (not title)
    const matchName = event.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Assuming filters.status and filters.type are still relevant and event has those properties
    const matchStatus = filters.status ? event.status === filters.status : true;
    const matchcategory = filters.category
      ? event.category === filters.category
      : true;


    const eventFrom = new Date(event.From);
    const eventTo = new Date(event.To);


    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;


    const matchDate = (
      (!fromDate || eventTo >= fromDate) && 
      (!toDate || eventFrom <= toDate)
    );

    return matchName && matchStatus && matchcategory && matchDate;
  });



  const statusOptions = [...new Set(eventData.map((e) => e.Status))];
  const typeOptions = [...new Set(eventData.map((e) => e.Category))];


  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Event Management</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/Admin/events/Manage_Categories")}
              className="bg-gray-300 text-gray-800 md:px-4 px-2 py-2 rounded-xl hover:bg-[#F48F0F] hover:opacity-90 hover:text-white text-sm"
            >
              Manage Categories
            </button>
            <button
              onClick={() =>
                navigate(`/Admin/Schedule-Event/new`)
              }
              className="bg-[#F48F0F] text-white md:px-4 px-2 py-2 rounded-xl hover:opacity-90 text-sm"
            >
              Schedule a New Event
            </button>
          </div>

        </div>

        {/* Search and Icon Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-300 w-full sm:max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              category="text"
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
                      category="date"
                      className="w-full border px-2 py-1 rounded text-sm mb-1"
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                      }
                    />
                    <h2 className="text-center text-sm">to</h2>
                    <input
                      category="date"
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
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      {/* {categoryOptions.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))} */}
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
                        category="checkbox"
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
            { key: "Category", label: "Category" },
            { key: "Status", label: "Status" },

          ]}
          rows={filteredEvents.map((event) => ({
            ...event,
            actions: (
              <>
                <FaEdit
                  className="text-[#F48F0F] cursor-pointer"
                  onClick={() =>
                    navigate(`/Admin/Edit-Event/${event.ID}`, {state: { event}})
                  }
                />
                <FaTrash
                  className="text-[#F48F0F] cursor-pointer ml-4"
                  onClick={() => confirmDelete(event.ID)}
                />
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
