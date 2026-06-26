import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrashAlt,
  FaSpinner,
  FaImages
} from "react-icons/fa";
import { compressImages } from "../../Admin/reusable/ImageCompressor";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const PublicUpload = () => {
  const { token } = useParams();
  const [eventName, setEventName] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const decoded = decodeToken(token);
    if (!decoded || decoded.type !== "upload" || !decoded.event_id) {
      setIsValid(false);
      return;
    }

    setEventName(decoded.event_name || "Event");

    // Check expiry
    const expTime = decoded.exp * 1000;
    if (expTime < Date.now()) {
      setIsExpired(true);
    }
  }, [token]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setStatus("uploading");
    setUploadProgress(10);

    try {
      // 1. Compress Images to optimize network speeds and storage sizes
      setUploadProgress(30);
      const compressedFiles = await compressImages(selectedFiles);
      setUploadProgress(50);

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("token", token);
      compressedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // 3. Post to backend
      setUploadProgress(70);
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/publicUploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadProgress(100);
      setStatus("success");
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.detail || "Failed to upload images. Please try again."
      );
    }
  };

  if (!isValid || isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF5EE] to-[#F5EFEB] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-red-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Expired or Invalid</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            This photo upload link is either expired, invalid, or has been deactivated by the administrator. Please request a new shareable link to upload your photos.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#F48F0F] text-white font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF5EE] to-[#F5EFEB] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-amber-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#F48F0F]" />
          <FaCheckCircle className="text-amber-500 text-5xl mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Photos Submitted!</h2>
          <p className="text-gray-500 text-sm mb-3 leading-relaxed">
            Thank you for contributing to{" "}
            <strong className="text-gray-700">{eventName}</strong>!
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-6 text-left flex gap-2">
            <span className="mt-0.5 flex-shrink-0">ℹ️</span>
            <span>
              Your photos are <strong>pending admin review</strong> and will appear in the public gallery once approved.
            </span>
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="bg-[#F48F0F] text-white font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity mr-3"
          >
            Upload More
          </button>
          <Link
            to="/"
            className="inline-block bg-gray-100 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Finish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF5EE] to-[#F5EFEB] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#F48F0F]" />
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 rounded-2xl mb-3 text-[#F48F0F]">
            <FaImages className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Upload Photos</h1>
          <p className="text-sm text-[#F48F0F] font-semibold mt-1">
            Event: {eventName}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Anyone with this link can upload photos to this event's gallery
          </p>
        </div>

        {status === "uploading" ? (
          <div className="text-center py-12">
            <FaSpinner className="text-4xl text-[#F48F0F] animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Uploading Images...</h3>
            <p className="text-xs text-gray-400 mt-1">Compressing and processing files, please don't close this tab.</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-6 max-w-xs mx-auto overflow-hidden">
              <div
                className="bg-[#F48F0F] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* File Dropzone */}
            <label className="border-2 border-dashed border-[#F48F0F]/30 hover:border-[#F48F0F] bg-[#FDF8F3]/40 hover:bg-[#FDF8F3]/80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center">
              <FaCloudUploadAlt className="text-4xl text-gray-400 group-hover:text-[#F48F0F] transition-colors mb-2" />
              <span className="text-sm font-semibold text-gray-700">Drag & drop files or click to upload</span>
              <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Error Message */}
            {status === "error" && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                <FaExclamationTriangle />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Selected File List */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Selected Images ({selectedFiles.length})
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs"
                    >
                      <span className="font-medium text-gray-700 truncate max-w-[80%]">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  className="w-full bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#F48F0F]/20 mt-6 transition-colors"
                >
                  Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Image" : "Images"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicUpload;
