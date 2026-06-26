import React, { useEffect, useState } from "react";
import axios from "axios";
import AddEditNoteModal from "./AddEditNoteModal";
import { FaPlus, FaTrash, FaEdit, FaPaperclip, FaDownload } from "react-icons/fa";

const MeetingNotesPanel = ({ meeting, onClose }) => {
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_NETWORK}/meetingNotes`,
        {
          params: {
            meetingId: meeting.meetingId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotes(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttachments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_NETWORK}/meeting/${meeting.meetingId}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttachments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchAttachments();
  }, [meeting.meetingId]);

  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/meetingNotes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const uploadAttachments = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/meeting/${meeting.meetingId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedFiles([]);
      fetchAttachments();
    } catch (err) {
      console.error(err);
      alert("Failed to upload attachments.");
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attachment?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/meeting/attachments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAttachments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-full max-w-md p-6 h-full flex flex-col shadow-2xl transition-transform duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 truncate max-w-[280px]">
              {meeting.title}
            </h2>
            <p className="text-xs text-gray-500">Manage notes and resources</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-sm font-medium px-2 py-1 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === "notes"
                ? "border-b-2 border-[#F48F0F] text-[#F48F0F]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Meeting Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab("attachments")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === "attachments"
                ? "border-b-2 border-[#F48F0F] text-[#F48F0F]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Attachments ({attachments.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          
          {activeTab === "notes" && (
            <div className="space-y-4">
              <button
                className="bg-[#F48F0F] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm flex items-center gap-1.5 w-full justify-center"
                onClick={() => setEditNote({})}
              >
                <FaPlus size={12} /> Add Note
              </button>

              {notes.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  No notes recorded for this meeting.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((n) => (
                    <div key={n.noteId} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white hover:border-orange-200 transition-colors">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{n.note}</p>
                      {n.createdAt && (
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      )}
                      <div className="flex gap-4 mt-3 pt-2 border-t border-gray-50">
                        <button 
                          onClick={() => setEditNote(n)}
                          className="text-[#F48F0F] hover:text-[#dc7d00] text-xs flex items-center gap-1"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => deleteNote(n.noteId)}
                          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                        >
                          <FaTrash size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="space-y-6">
              
              {/* Attachment Upload Form */}
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <FaPaperclip size={12} /> Attach Files
                </h4>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-[#F48F0F] hover:file:bg-orange-200 cursor-pointer"
                />
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-gray-500 font-medium">Selected files ({selectedFiles.length}):</p>
                    <ul className="text-[10px] text-gray-600 list-disc list-inside">
                      {selectedFiles.map((f, i) => (
                        <li key={i} className="truncate">{f.name}</li>
                      ))}
                    </ul>
                    <button
                      disabled={uploading}
                      onClick={uploadAttachments}
                      className="bg-[#F48F0F] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg hover:opacity-90 text-xs w-full font-medium"
                    >
                      {uploading ? "Uploading..." : "Upload Selected Files"}
                    </button>
                  </div>
                )}
              </div>

              {/* Attachments List */}
              {attachments.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  No attachments linked with this meeting.
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((a) => (
                    <div key={a.id} className="border border-gray-100 p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[260px]" title={a.fileName}>
                          {a.fileName}
                        </span>
                        {a.createdAt && (
                          <span className="text-[9px] text-gray-400 mt-0.5">
                            Uploaded: {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2.5 flex-shrink-0">
                        <a
                          href={a.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F48F0F] hover:text-[#dc7d00] p-1.5 hover:bg-orange-50 rounded"
                          title="Download"
                        >
                          <FaDownload size={12} />
                        </a>
                        <button
                          onClick={() => deleteAttachment(a.id)}
                          className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

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
