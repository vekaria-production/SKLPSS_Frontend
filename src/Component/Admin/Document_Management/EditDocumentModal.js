import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaSpinner } from "react-icons/fa";

const EditDocumentModal = ({ document, onClose, onUpdated }) => {
  const [documentName, setDocumentName] = useState(document?.DocumentName || "");
  const [category, setCategory] = useState(document?.Category || "");
  const [description, setDescription] = useState(document?.Description || "");
  const [status, setStatus] = useState(document?.Status || "active");
  
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Custom Type Options State (loaded dynamically from database)
  const [typeOptions, setTypeOptions] = useState([]);
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeVal, setNewTypeVal] = useState("");

  // Fetch document types on component load
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_NETWORK}/document-types`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTypeOptions(res.data.map((t) => t.name));
      } catch (err) {
        console.error("Failed to fetch document types from database", err);
        setTypeOptions(["Circular", "Minutes", "Accounts", "Report"]);
      }
    };
    fetchTypes();
  }, []);

  const handleAddNewType = async () => {
    const trimmed = newTypeVal.trim();
    if (!trimmed) return alert("Please enter a valid type name");

    setSaving(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/document-types`,
        { name: trimmed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!typeOptions.includes(trimmed)) {
        setTypeOptions((prev) => [...prev, trimmed]);
      }
      setCategory(trimmed);
      setNewTypeVal("");
      setShowAddType(false);
    } catch (err) {
      console.error("Failed to add type", err);
      alert(err.response?.data?.detail || "Failed to register new document type in database");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!documentName.trim()) return alert("Document name is required");
    if (!category.trim()) return alert("Please select or specify a type");

    setSaving(true);
    const formData = new FormData();
    formData.append("document_name", documentName.trim());
    formData.append("category", category.trim());
    formData.append("description", description.trim());
    formData.append("status", status);

    try {
      await axios.put(
        `${process.env.REACT_APP_NETWORK}/documents/${document.DocumentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Title */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Document</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Document Name</label>
              <input
                type="text"
                placeholder="Document Name"
                className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
                <button
                  type="button"
                  onClick={() => setShowAddType((prev) => !prev)}
                  className="text-xs text-[#F48F0F] hover:underline font-semibold"
                  disabled={saving}
                >
                  {showAddType ? "Cancel" : "+ Add Type"}
                </button>
              </div>

              {showAddType ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter new type..."
                    className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 flex-1 text-sm transition-all"
                    value={newTypeVal}
                    onChange={(e) => setNewTypeVal(e.target.value)}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewType}
                    className="bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    disabled={saving}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={saving}
                >
                  <option value="">Select Type</option>
                  {typeOptions.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
              <select
                className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all bg-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
              <textarea
                placeholder="Details about this document..."
                rows={3}
                className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white font-semibold rounded-xl text-sm shadow-md shadow-[#F48F0F]/15 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDocumentModal;
