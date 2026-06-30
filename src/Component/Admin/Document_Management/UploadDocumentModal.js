import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaFileAlt, FaTimes, FaSpinner } from "react-icons/fa";

const UploadDocumentModal = ({ onClose, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Custom Type Options State (loaded dynamically from database)
  const [typeOptions, setTypeOptions] = useState([]);
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeVal, setNewTypeVal] = useState("");

  const fileInputRef = useRef(null);

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
        // Fallback options
        setTypeOptions(["Circular", "Minutes", "Accounts", "Report"]);
      }
    };
    fetchTypes();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAddNewType = async () => {
    const trimmed = newTypeVal.trim();
    if (!trimmed) return alert("Please enter a valid type name");

    setUploading(true);
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
      console.error("Failed to add type to DB", err);
      alert(err.response?.data?.detail || "Failed to register new document type in database");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return alert("Please select or drop at least one file");
    if (!category.trim()) return alert("Please select or specify a type");

    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("uploaded_by", localStorage.getItem("userId") || "");
    formData.append("category", category.trim());
    formData.append("description", description.trim());

    try {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Title */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={uploading}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
              dragActive
                ? "border-[#F48F0F] bg-[#FDBF0F]/10 scale-[0.99]"
                : "border-gray-300 hover:border-[#F48F0F] hover:bg-[#FDBF0F]/5"
            } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <FaCloudUploadAlt size={48} className="text-[#F48F0F] mb-2" />
            <p className="text-sm font-semibold text-gray-700 text-center">
              Drag & drop files here, or <span className="text-[#F48F0F] underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports any document types</p>
          </div>

          {/* Staged Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Staged Files ({files.length})</h4>
              <div className="max-h-36 overflow-y-auto border border-gray-100 rounded-xl p-2 space-y-1.5 bg-gray-50/50">
                {files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[80%]">
                      <FaFileAlt className="text-[#F48F0F] shrink-0" />
                      <span className="font-semibold text-gray-700 truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({formatSize(file.size)})</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      disabled={uploading}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
                <button
                  type="button"
                  onClick={() => setShowAddType((prev) => !prev)}
                  className="text-xs text-[#F48F0F] hover:underline font-semibold"
                  disabled={uploading}
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
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewType}
                    className="bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    disabled={uploading}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
              <textarea
                placeholder="Optional details about these files..."
                rows={3}
                className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]/20 focus:border-[#F48F0F] rounded-xl px-3 py-2 w-full text-sm transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-5 py-2 bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white font-semibold rounded-xl text-sm shadow-md shadow-[#F48F0F]/15 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
