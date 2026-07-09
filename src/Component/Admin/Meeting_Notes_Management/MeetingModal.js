import React, { useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const MeetingModal = ({ meeting, onClose, onSaved }) => {
  const [form, setForm] = useState({
    Title: meeting?.title || "",
    Description: meeting?.description || "",
    MeetingLink: meeting?.meetingLink || "",
    StartTime: meeting?.startTime || "",
    EndTime: meeting?.endTime || "",
    Status: meeting?.status || "scheduled",
  });

  const handleSubmit = async () => {
    const url = meeting
      ? `${process.env.REACT_APP_NETWORK}/meeting/${meeting.meetingId}`
      : `${process.env.REACT_APP_NETWORK}/meeting`;

    const method = meeting ? "put" : "post";

    await axios[method](url, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {meeting ? "Edit Meeting" : "Create Meeting"}
        </h2>

        {/* Title */}
        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Title"
          value={form.Title}
          onChange={(e) => setForm({ ...form, Title: e.target.value })}
        />

        {/* Description */}
        <textarea
          className="border w-full mb-3 p-2 rounded"
          placeholder="Description"
          value={form.Description}
          onChange={(e) => setForm({ ...form, Description: e.target.value })}
        />

        {/* Meeting Link */}
        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Meeting Link"
          value={form.MeetingLink}
          onChange={(e) => setForm({ ...form, MeetingLink: e.target.value })}
        />

        {/* Date Fields */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-600">From Date:</label>
            <input
              type="datetime-local"
              className="border border-gray-300 w-full p-2 rounded"
              value={form.StartTime}
              onChange={(e) =>
                setForm({ ...form, StartTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-600">To Date:</label>
            <input
              type="datetime-local"
              className="border border-gray-300 w-full p-2 rounded"
              value={form.EndTime}
              onChange={(e) =>
                setForm({ ...form, EndTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* ✅ Status Dropdown */}
        <select
          className="border w-full mb-4 p-2 rounded"
          value={form.Status}
          onChange={(e) => setForm({ ...form, Status: e.target.value })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
