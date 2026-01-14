import React, { useEffect, useState } from "react";
import axios from "axios";
import AddEditNoteModal from "./AddEditNoteModal";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const MeetingNotesPanel = ({ meeting, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const userId = localStorage.getItem("userId");

  const fetchNotes = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_NETWORK}/meetingNotes`,
      {
        params: {
          meetingId: meeting.meetingId,
          userId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setNotes(res.data.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const deleteNote = async (noteId) => {
    await axios.delete(
      `${process.env.REACT_APP_NETWORK}/meetingNotes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchNotes();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-full max-w-md p-4">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">My Notes – {meeting.title}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <button
          className="btn-primary mb-3"
          onClick={() => setEditNote({})}
        >
          <FaPlus className="mr-2" /> Add Note
        </button>

        {notes.map((n) => (
          <div key={n.noteId} className="border p-2 rounded mb-2">
            <p className="text-sm">{n.note}</p>
            <div className="flex gap-3 mt-2">
              <FaEdit className="icon-action" onClick={() => setEditNote(n)} />
              <FaTrash
                className="icon-action"
                onClick={() => deleteNote(n.noteId)}
              />
            </div>
          </div>
        ))}

        {editNote !== null && (
          <AddEditNoteModal
            meetingId={meeting.meetingId}
            note={editNote}
            onClose={() => setEditNote(null)}
            onSaved={fetchNotes}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingNotesPanel;
