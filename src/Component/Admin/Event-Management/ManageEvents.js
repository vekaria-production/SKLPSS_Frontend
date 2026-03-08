import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";

import DeleteConfirmation from "../reusable/DeleteConfirmation";
import axios from "axios";
import { CircleCheckBig, Clock, TicketCheck, Users } from "lucide-react";


async function getEventsData({ offset = 0, limit = 100 } = {}) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
      params: { offset, limit },
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
  // State for user modal and registered users
  const [showUserModal, setShowUserModal] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userModalLoading, setUserModalLoading] = useState(false);
  const [userModalError, setUserModalError] = useState("");

  const [totalRegCount, setTotalRegCount] = useState(0);

  // Fetch registered users for an event
  async function showUser(eventId) {
    setShowUserModal(true);
    setUserModalLoading(true);
    setUserModalError("");
    setTotalRegCount(0);
    setRegisteredUsers([]);

    try {
      const response = await axios.get(`${process.env.REACT_APP_NETWORK}/event_registrations/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data) {
        setTotalRegCount(response.data.total_registrations || 0);
        setRegisteredUsers(response.data.registrations || []);
      }
    } catch (err) {
      console.error(err);
      setUserModalError("Failed to load registrations.");
    } finally {
      setUserModalLoading(false);
    }
  }

  function closeUserModal() {
    setShowUserModal(false);
    setRegisteredUsers([]);
    setTotalRegCount(0);
    setUserModalError("");
  }

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
        FormattedToTime: formattedToTime,
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

  async function handleDeleteConfirmed() {

    try {
      await axios.delete(`${process.env.REACT_APP_NETWORK}/deleteEvent/${deleteId}`, {
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

  const filteredEvents = eventData.filter((event) => {
    // Case-insensitive search on Name (not title)
    const matchName = event.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Compare using the actual properties returned/normalized on events
    const matchStatus = filters.status ? event.Status === filters.status : true;
    const matchCategory = filters.category
      ? event.Category === filters.category
      : true;


    const eventFrom = new Date(event.From);
    const eventTo = new Date(event.To);


    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;


    const matchDate = (
      (!fromDate || eventTo >= fromDate) &&
      (!toDate || eventFrom <= toDate)
    );

    return matchName && matchStatus && matchCategory && matchDate;
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
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
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
                    navigate(`/Admin/Edit-Event/${event.ID}`, { state: { event } })
                  }
                />
                <FaTrash
                  className="text-[#F48F0F] cursor-pointer ml-4"
                  onClick={() => confirmDelete(event.ID)}
                />
                <Users
                  className="text-[#F48F0F] cursor-pointer ml-4"
                  onClick={() => showUser(event.ID)}
                  title="Show Registered Users"
                />
                {/* Registered Users Modal */}
                {showUserModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={closeUserModal}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h2 className="text-xl font-semibold mb-4">Registered Users ({totalRegCount})</h2>
                      {userModalLoading ? (
                        <div className="text-center py-8">Loading...</div>
                      ) : userModalError ? (
                        <div className="text-red-500 text-center py-8">{userModalError}</div>
                      ) : registeredUsers.length === 0 ? (
                        <div className="text-center py-8">No users registered for this event.</div>
                      ) : (
                        <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto pr-2">
                          {registeredUsers.map((user, idx) => (
                            <li key={user.registration_id || idx} className="py-3 px-2 flex items-center justify-between hover:bg-gray-50 rounded-md transition-colors">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                  {user.phone_number} {user.is_member ? `(Member: ${user.member_id})` : "(Guest)"}
                                </span>
                                {user.registered_at && (
                                  <span className="text-xs text-gray-500 mt-0.5">
                                    Registered: {new Date(user.registered_at).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div>
                                {user.checked_in ? (
                                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 uppercase tracking-wider rounded-full font-bold">Checked In</span>
                                ) : (
                                  <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 uppercase tracking-wider rounded-full font-bold">Pending</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {event.Status == "ongoing" ?
                  <TicketCheck
                    className="text-[#F48F0F] cursor-pointer ml-4"
                    onClick={() =>
                      navigate("/Admin/Event-Registration", { state: { event } })
                    }
                  /> :
                  event.Status == "completed" ?
                    <CircleCheckBig
                      className="text-green-400 cursor-not-allowed ml-4"
                    /> :
                    <Clock
                      className="text-gray-400 cursor-not-allowed ml-4"
                    />
                }

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
