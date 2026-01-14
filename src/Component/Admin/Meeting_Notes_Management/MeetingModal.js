import React, { useState } from "react";
import axios from "axios";

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

        {Object.keys(form).map((k) => (
          <input
            key={k}
            placeholder={k}
            className="border w-full mb-3 p-2 rounded"
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}

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
