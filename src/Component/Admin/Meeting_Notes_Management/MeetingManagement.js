import React, { useEffect, useState } from "react";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import axios from "axios";
import { FaPlus, FaStickyNote, FaTrash, FaEdit } from "react-icons/fa";
import MeetingModal from "./MeetingModal";
import MeetingNotesPanel from "./MeetingNotesPanel";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import useDebounce from "../../../hooks/useDebounce";

const MeetingManagement = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const fetchMeetings = async (titleVal = debouncedSearchTerm, statusVal = filters.status) => {
    const res = await axios.get(
      `${process.env.REACT_APP_NETWORK}/meeting`,
      {
        params: {
          limit: 1000,
          title: titleVal || undefined,
          status: statusVal || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setMeetings(res.data.data);
  };

  useEffect(() => {
    fetchMeetings(debouncedSearchTerm, filters.status);
  }, [debouncedSearchTerm, filters.status]);

  const handleDelete = async () => {
    await axios.delete(
      `${process.env.REACT_APP_NETWORK}/meeting/${deleteTarget.meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setDeleteTarget(null);
    fetchMeetings();
  };

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Meeting Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90 text-sm flex items-center shadow-md shadow-[#F48F0F]/15"
          >
            <FaPlus className="mr-2" /> Create Meeting
          </button>
        </div>

        {/* Global Filter Bar & Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-[#F48F0F] focus:border-transparent transition bg-gray-50/50"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:max-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#F48F0F] focus:border-transparent transition bg-gray-50/50"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {(searchTerm || filters.status) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ status: "" });
                }}
                className="text-xs text-[#F48F0F] hover:underline font-semibold self-center sm:self-auto"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-gray-100 p-0.5 rounded-xl border border-gray-200 flex items-center">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "card"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Card View
              </button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <CustomTable
            cols={[
              { key: "title", label: "Title" },
              { key: "status", label: "Status" },
              { key: "formattedStartTime", label: "Start" },
              { key: "formattedEndTime", label: "End" },
            ]}
            onRowClick={(row) => setSelectedMeeting(row)}
            rows={meetings.map((m) => ({
              ...m,
              formattedStartTime: new Date(m.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
              formattedEndTime: m.endTime ? new Date(m.endTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : "-",
              actions: (
                <div className="flex gap-3">
                  <FaStickyNote
                    size={20}
                    className="icon-action text-[#F48F0F] cursor-pointer"
                    onClick={() => setSelectedMeeting(m)}
                    title="Notes & Attachments"
                  />
                  <FaEdit
                    size={20}
                    className="icon-action text-[#F48F0F] cursor-pointer"
                    onClick={() => {
                      setEditMeeting(m);
                      setShowModal(true);
                    }}
                    title="Edit Meeting"
                  />
                  <FaTrash
                    size={20}
                    className="icon-action text-[#F48F0F] cursor-pointer"
                    onClick={() => setDeleteTarget(m)}
                    title="Delete Meeting"
                  />
                </div>
              ),
            }))}
          />
        ) : (
          /* Card View Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((m) => {
              const statusColors = {
                scheduled: "bg-blue-50 text-blue-700 border-blue-100",
                completed: "bg-green-50 text-green-700 border-green-100",
                cancelled: "bg-red-50 text-red-700 border-red-100",
              };
              const statusClass = statusColors[m.status.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-100";
              
              return (
                <div 
                  key={m.meetingId} 
                  onClick={(e) => {
                    if (
                      e.target.closest("button") ||
                      e.target.closest("a") ||
                      e.target.closest(".icon-action")
                    ) {
                      return;
                    }
                    setSelectedMeeting(m);
                  }}
                  className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between min-h-[180px] cursor-pointer hover:border-[#F48F0F]/30 hover:bg-orange-50/10 group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-bold text-gray-800 text-lg line-clamp-2 group-hover:text-[#F48F0F] transition-colors" title={m.title}>
                        {m.title}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold flex-shrink-0 ${statusClass}`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                      <div>
                        <span className="font-medium text-gray-400">Start: </span>
                        <span className="font-semibold text-gray-700">{new Date(m.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">End: </span>
                        <span className="font-semibold text-gray-700">{m.endTime ? new Date(m.endTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-3 mt-auto">
                    <button
                      onClick={() => setSelectedMeeting(m)}
                      className="p-2.5 bg-amber-50 hover:bg-[#F48F0F]/15 text-[#F48F0F] rounded-xl transition-colors cursor-pointer"
                      title="Notes & Attachments"
                    >
                      <FaStickyNote size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setEditMeeting(m);
                        setShowModal(true);
                      }}
                      className="p-2.5 bg-amber-50 hover:bg-[#F48F0F]/15 text-[#F48F0F] rounded-xl transition-colors cursor-pointer"
                      title="Edit Meeting"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(m)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                      title="Delete Meeting"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
            {meetings.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-100">
                No meetings found.
              </div>
            )}
          </div>
        )}

        {showModal && (
          <MeetingModal
            meeting={editMeeting}
            onClose={() => {
              setShowModal(false);
              setEditMeeting(null);
            }}
            onSaved={fetchMeetings}
          />
        )}

        {selectedMeeting && (
          <MeetingNotesPanel
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
          />
        )}

        {deleteTarget && (
          <DeleteConfirmation
            title="Delete Meeting"
            message={`Are you sure you want to delete ${deleteTarget.title}?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default MeetingManagement;
