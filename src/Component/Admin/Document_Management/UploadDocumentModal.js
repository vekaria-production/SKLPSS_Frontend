import React, { useState } from "react";
import axios from "axios";

const UploadDocumentModal = ({ onClose, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!files.length) return alert("Select files");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("uploaded_by", localStorage.getItem("userId"));
    formData.append("category", category);
    formData.append("description", description);

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
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Upload Documents
        </h2>

        <input
          type="file"
          multiple
          className="mb-3"
          onChange={(e) => setFiles([...e.target.files])}
        />

        <input
          type="text"
          placeholder="Category"
          className="border border-gray-300 rounded px-2 py-2 w-full mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border border-gray-300 rounded px-2 py-2 w-full mb-4 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button className="text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
