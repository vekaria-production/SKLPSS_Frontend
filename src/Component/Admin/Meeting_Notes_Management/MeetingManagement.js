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
  const [showFiltersRow, setShowFiltersRow] = useState(false);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Meeting Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90 text-sm flex items-center"
          >
            <FaPlus className="mr-2" /> Create Meeting
          </button>
        </div>

        <CustomTable
          cols={[
            { key: "title", label: "Title", filterable: true },
            { key: "status", label: "Status", filterable: true },
            { key: "formattedStartTime", label: "Start" },
            { key: "formattedEndTime", label: "End" },
          ]}
          rows={meetings.map((m) => ({
            ...m,
            formattedStartTime: new Date(m.startTime).toLocaleString(),
            formattedEndTime: m.endTime ? new Date(m.endTime).toLocaleString() : "-",
            actions: (
              <div className="flex gap-3">
                <FaStickyNote
                  className="icon-action text-[#F48F0F] cursor-pointer"
                  onClick={() => setSelectedMeeting(m)}
                  title="Notes & Attachments"
                />
                <FaEdit
                  className="icon-action text-[#F48F0F] cursor-pointer"
                  onClick={() => {
                    setEditMeeting(m);
                    setShowModal(true);
                  }}
                  title="Edit Meeting"
                />
                <FaTrash
                  className="icon-action text-[#F48F0F] cursor-pointer"
                  onClick={() => setDeleteTarget(m)}
                  title="Delete Meeting"
                />
              </div>
            ),
          }))}
          showFiltersRow={showFiltersRow}
          onToggleFilters={() => setShowFiltersRow(!showFiltersRow)}
          filterRow={showFiltersRow ? (col) => {
            if (col.key === "title") {
              return (
                <input
                  type="text"
                  placeholder="Filter title..."
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              );
            }
            if (col.key === "status") {
              return (
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              );
            }
            if (col.key === "actions") {
              if (filters.status || searchTerm) {
                return (
                  <button
                    onClick={() => {
                      setFilters({ status: "" });
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
