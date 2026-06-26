import React, { useState, useRef } from "react";
import axios from "axios";
import { FaBold, FaItalic, FaListUl, FaCode, FaLink, FaEraser, FaTimes } from "react-icons/fa";

const AddEditNoteModal = ({ meetingId, note, onClose, onSaved }) => {
  const [text, setText] = useState(note.note || "");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const insertFormatting = (syntaxBefore, syntaxAfter = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const replacement = syntaxBefore + selectedText + syntaxAfter;

    setText(text.substring(0, start) + replacement + text.substring(end));

    // Refocus and select the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + selectedText.length
      );
    }, 50);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      alert("Note text cannot be empty.");
      return;
    }
    setSaving(true);
    const payload = {
      MeetingId: meetingId,
      User: user,
      Note: text,
    };

    try {
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
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const formattingOptions = [
    { icon: <FaBold size={12} />, label: "Bold", action: () => insertFormatting("**", "**") },
    { icon: <FaItalic size={12} />, label: "Italic", action: () => insertFormatting("*", "*") },
    { icon: <FaListUl size={12} />, label: "Bullet List", action: () => insertFormatting("\n- ") },
    { icon: <FaCode size={12} />, label: "Code Block", action: () => insertFormatting("`", "`") },
    { icon: <FaLink size={12} />, label: "Link", action: () => insertFormatting("[text](", ")") },
    { icon: <FaEraser size={12} />, label: "Clear", action: () => setText("") },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/30 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800 text-base">
              {note.noteId ? "Edit Note" : "Add Note"}
            </h3>
            <p className="text-[10px] text-gray-500">Add key updates, links, or decisions</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border-b border-gray-100 flex-wrap">
          {formattingOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="p-2 rounded text-gray-600 hover:text-[#F48F0F] hover:bg-orange-50 transition-colors flex items-center justify-center"
              title={opt.label}
              type="button"
            >
              {opt.icon}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto select-none">
            {text.length} chars
          </span>
        </div>

        {/* Text Area */}
        <div className="p-4 bg-white">
          <textarea
            ref={textareaRef}
            id="note-textarea"
            className="w-full p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-1 focus:ring-orange-200 resize-none min-h-[160px] transition-all"
            placeholder="Type your meeting notes here... (Markdown tags supported)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-[#F48F0F] hover:bg-[#e07f0b] rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEditNoteModal;
