import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesData, allSubjectsData } from "../../../../assets/CoursesData";
import { Save, X } from "lucide-react";
import Edu_layout from "../reusable/Edu_layout";

const VideoForm = () => {
  const { courseid, chapterid, Videoid } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isCoordinator, setIsCoordinator] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const isNew = Videoid === "new";
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
  // Adjust this endpoint to match your backend route
  const UPLOAD_ENDPOINT = `${API_BASE}/api/videos`;

  useEffect(() => {
    // Get course
    const selectedCourse = coursesData.find(
      (item) => item.id === parseInt(courseid)
    );
    setCourse(selectedCourse);
    
    // Check if current user is the course coordinator
    const role = localStorage.getItem("role") || "";
    const currentUser = localStorage.getItem("username") || "";
    const coordinator = selectedCourse?.coordinator;
    setIsCoordinator(role === "Teacher" && coordinator === currentUser);

    // If editing, prefill form
    if (!isNew) {
      const modules = allSubjectsData[courseid] || [];
      const module = modules.find((m) => m.id === parseInt(chapterid));

      if (module) {
        const found = module.content.find(
          (item) =>
            item.type === "Video" &&
            item.id === Videoid
        );

        if (found) {
          setTitle(found.title || "");
          // For editing, user can upload a new file to replace existing one
        }
      }
    }
  }, [courseid, chapterid, Videoid, isNew]);

  const generateVideoId = () => {
    const modules = allSubjectsData[courseid] || [];
    const module = modules.find((m) => m.id === parseInt(chapterid));
    
    if (!module) return `v${Date.now()}`;
    
    // Get existing video IDs in this module
    const existingVideos = module.content.filter(item => item.type === "Video");
    const videoCount = existingVideos.length + 1;
    
    // Generate ID based on course and chapter
    const coursePrefix = courseid === "1" ? "m" : courseid === "2" ? "p" : courseid === "3" ? "g" : courseid === "4" ? "c" : "x";
    const chapterNum = chapterid.toString().slice(-1); // Get last digit of chapter ID
    
    return `${coursePrefix}${chapterNum}v${videoCount}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    setErrorMessage("");
    if (isNew && !selectedFile) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    if (selectedFile) formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("courseId", courseid);
    formData.append("chapterId", chapterid);
    formData.append("type", "Video");
    formData.append("id", isNew ? generateVideoId() : Videoid);

    try {
      setIsSubmitting(true);
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error( "Upload failed");
      }

      alert("Video uploaded successfully");
      navigate(-1);
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong while uploading.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not coordinator, show access denied
  if (!isCoordinator) {
    return (
      <Edu_layout>
        <div className="p-6 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              Only the course coordinator can add or edit videos for this course.
            </p>
            <p className="text-sm text-red-500 dark:text-red-400">
              Course Coordinator: {course?.coordinator}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Edu_layout>
    );
  }

  return (
    <Edu_layout>
      <div className="min-h-fill p-4 sm:p-8 bg-[#FDF8F3] dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-300">
        {/* Header */}
        <div className="mb-6 border-b border-[#E1D5C9] pb-3 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {course?.name || "Subject Name"}
          </h1>
          {!isNew && (
            <span className="text-sm bg-[#F48F0F]/10 text-[#F48F0F] px-3 py-1 rounded-full">
              Editing Video
            </span>
          )}
        </div>

        {/* Video Title */}
        <div className="mb-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 hover:shadow-md transition">
          <label className="block font-medium mb-2 text-sm">Video Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Video Upload */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Upload Video File</h2>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 ${isDragging ? "border-[#F48F0F] bg-[#F48F0F]/5" : "border-dashed border-gray-300 dark:border-zinc-700"} rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition`}
            onClick={() => document.getElementById("video-file-input")?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById("video-file-input")?.click(); } }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drag & drop your video here, or <span className="text-[#F48F0F] font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP4, WebM, MOV, etc. up to your server limit</p>
            <input
              id="video-file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Selected: {selectedFile.name}
            </p>
          )}
          {!isNew && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Uploading a new file will replace the existing video.
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border text-black rounded-lg hover:bg-gray-100 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 transition flex items-center gap-1"
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || !title || (isNew && !selectedFile)}
            className="px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:opacity-90 transition flex items-center gap-1 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {isSubmitting ? "Saving..." : "Save Video"}
          </button>
        </div>
      </div>
    </Edu_layout>
  );
};

export default VideoForm;
