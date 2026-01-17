import React, { useState } from "react";
import axios from "axios";

const AddEditNoteModal = ({ meetingId, note, onClose, onSaved }) => {
  const [text, setText] = useState(note.note || "");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSave = async () => {
    const payload = {
      MeetingId: meetingId,
      User: user,
      Note: text,
    };
    console.log(payload);
    if (note.noteId) {
      await axios.put(
        `${process.env.REACT_APP_NETWORK}/meetingNotes/${note.noteId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/meetingNotes`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-full max-w-sm">
        <textarea
          className="border w-full p-2 mb-4"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNoteModal;
