import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog, FaLink, FaSpinner } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";

import DeleteConfirmation from "../reusable/DeleteConfirmation";
import axios from "axios";
import { CircleCheckBig, Clock, TicketCheck, Users } from "lucide-react";
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
        params: { limit: 10000 },
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
  const [allCategories, setAllCategories] = useState([]);
  const [visibleCols, setVisibleCols] = useState({
    Name: true,
    FormattedFromTime: true,
    FormattedToTime: true,
    Category: true,
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

  const [deleteId, setDeleteId] = useState(null);
  const settingsRef = useRef();

  const [shareEventId, setShareEventId] = useState(null);
  const [shareExpiry, setShareExpiry] = useState(24); // default 24 hours
  const [copiedMessage, setCopiedMessage] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NETWORK}/generateUploadLink/${shareEventId}`,
        {
          params: { expires_in_hours: shareExpiry },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { token } = response.data;
      const fullUrl = `${window.location.origin}/public-upload/${token}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedMessage("Upload link copied to clipboard!");
      setTimeout(() => {
        setCopiedMessage("");
        setShareEventId(null);
      }, 2000);
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Failed to generate link.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

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

    setEventData(updatedEvents)
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/CategoryList`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        let data = response.data;
        if (typeof data === 'string') data = JSON.parse(data);
        if (data && data.data) {
          setAllCategories(data.data.map(c => c[1]));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents(debouncedSearchTerm, filters);
  }, [debouncedSearchTerm, filters.category, filters.status, filters.fromDate, filters.toDate]);

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

  }

  const filteredEvents = eventData;



  const statusOptions = ["upcoming", "ongoing", "completed"];
  const typeOptions = allCategories;

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 min-h-[550px] relative">
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
                      Category: "Category",
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
            { key: "Category", label: "Category", filterable: true },
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
                    navigate(`/Admin/Edit-Event/${event.ID}`, { state: { event } })
                  }
                  title="Edit Event"
                />
                <FaTrash
                  size={18}
                  className="text-red-500 hover:text-red-600 cursor-pointer ml-3 transition-colors"
                  onClick={() => confirmDelete(event.ID)}
                  title="Delete Event"
                />
                <Users
                  size={18}
                  className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer ml-3 transition-colors inline-block"
                  onClick={() => showUser(event.ID)}
                  title="Show Registered Users"
                />
                <FaLink
                  size={18}
                  className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer ml-3 transition-colors"
                  onClick={() => setShareEventId(event.ID)}
                  title="Generate shareable image upload link"
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
                  {typeOptions.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
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
              if (filters.status || filters.category || filters.fromDate || filters.toDate || searchTerm) {
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

        {/* Share Link Modal */}
        {shareEventId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-gray-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                onClick={() => {
                  setShareEventId(null);
                  setCopiedMessage("");
                }}
              >
                &times;
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">Share Upload Link</h2>
              <p className="text-gray-500 text-xs mb-6">
                Generate a secure, time-limited link that allows guests to upload photos directly to this event's gallery.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Link Expiry Duration
                  </label>
                  <select
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:border-[#F48F0F] focus:ring-[#F48F0F]"
                  >
                    <option value={2}>2 Hours</option>
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (1 Day)</option>
                    <option value={48}>48 Hours (2 Days)</option>
                    <option value={168}>7 Days</option>
                    <option value={720}>30 Days</option>
                    <option value={8760}>1 Year</option>
                  </select>
                </div>
                
                {copiedMessage ? (
                  <div className="bg-green-50 text-green-700 border border-green-100 rounded-xl p-3 text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="animate-bounce">✓</span> {copiedMessage}
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateShareLink}
                    disabled={isGeneratingLink}
                    className="w-full bg-[#F48F0F] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[#F48F0F]/15"
                  >
                    {isGeneratingLink ? (
                      <>
                        <FaSpinner className="animate-spin" /> Generating...
                      </>
                    ) : (
                      "Generate & Copy Link"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageEvents;
