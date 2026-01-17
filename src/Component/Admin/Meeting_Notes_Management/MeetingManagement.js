import React, { useEffect, useState } from "react";
import SidebarLayout from "../reusable/SidebarLayout";
import axios from "axios";
import { FaPlus, FaStickyNote, FaTrash, FaEdit } from "react-icons/fa";
import MeetingModal from "./MeetingModal";
import MeetingNotesPanel from "./MeetingNotesPanel";
import DeleteConfirmation from "../reusable/DeleteConfirmation";

const MeetingManagement = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMeetings = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_NETWORK}/meeting`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setMeetings(res.data.data);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

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
      <div className="bg-[var(--color-bg)] p-4">

        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-semibold">Meeting Management</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="mr-2" /> Create Meeting
          </button>
        </div>

        <table className="w-full bg-white border rounded-md">
          <thead className="border-b">
            <tr>
              <th className="p-2 text-left">Title</th>
              {/* <th>Status</th> */}
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.meetingId} className="border-b hover:bg-gray-50">
                <td className="p-2">{m.title}</td>
                <td>{m.status}</td>
                <td>{new Date(m.startTime).toLocaleString()}</td>
                <td>{new Date(m.endTime).toLocaleString()}</td>
                <td className="flex gap-3 p-2">
                  <FaStickyNote
                    className="icon-action"
                    onClick={() => setSelectedMeeting(m)}
                  />
                  <FaEdit
                    className="icon-action"
                    onClick={() => {
                      setEditMeeting(m);
                      setShowModal(true);
                    }}
                  />
                  <FaTrash
                    className="icon-action"
                    onClick={() => setDeleteTarget(m)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
            message={`Delete ${deleteTarget.title}?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default MeetingManagement;
