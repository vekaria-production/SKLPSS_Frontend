import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesData, allSubjectsData } from "../../../../assets/CoursesData";
import { Save, X } from "lucide-react";
import Edu_layout from "../reusable/Edu_layout";
const AssignmentForm = () => {
  const { courseid, chapterid, Assignmentid } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [Assignment, setAssignment] = useState(null);
  const [isCoordinator, setIsCoordinator] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileCount, setFileCount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const isNew = Assignmentid === "new";

  const fileTypeOptions = [
    "Image: JPG/JPEG/PNG",
    "Text: .txt",
    "Compressed: .zip/.rar",
    "Document: .doc/.docx/.pdf",
    "PDF",
    "Accept Any type of file",
  ];

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
            item.type === "Assignment" &&
            item.id === Assignmentid
        );

        if (found) {
          setAssignment(found);
          setTitle(found.title || "");
          setInstructions(found.instructions || "");
          setFileType(found.file_type || found.fileLimit?.split(". Max")[0] || "");
          setFileSize(found.max_size || found.fileLimit?.match(/(\d+)MB/)?.[1] || "");
          setFileCount(found.max_files || "");
          setDueDate(found.dueDate || "");
        }
      }
    }
  }, [courseid, chapterid, Assignmentid, isNew]);

  const generateAssignmentId = () => {
    const modules = allSubjectsData[courseid] || [];
    const module = modules.find((m) => m.id === parseInt(chapterid));
    
    if (!module) return `a${Date.now()}`;
    
    // Get existing assignment IDs in this module
    const existingAssignments = module.content.filter(item => item.type === "Assignment");
    const assignmentCount = existingAssignments.length + 1;
    
    // Generate ID based on course and chapter
    const coursePrefix = courseid === "1" ? "m" : courseid === "2" ? "p" : courseid === "3" ? "g" : courseid === "4" ? "c" : "x";
    const chapterNum = chapterid.toString().slice(-1); // Get last digit of chapter ID
    
    return `${coursePrefix}${chapterNum}a${assignmentCount}`;
  };

  const handleSave = () => {
    const finalData = {
      id: isNew ? generateAssignmentId() : Assignmentid,
      type: "Assignment",
      title,
      instructions,
      file_type: fileType,
      max_size: fileSize,
      max_files: fileCount,
      dueDate,
      submitted: false
    };
    console.log("Saving assignment:", finalData);
    // TODO: Send to backend or update allSubjectsData
    navigate(-1);
  };

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
              Editing Assignment
            </span>
          )}
        </div>

        {/* Assignment Title */}
        <div className="mb-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 hover:shadow-md transition">
          <label className="block font-medium mb-2 text-sm">Assignment Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <textarea
            className="w-full bg-transparent outline-none resize-none mt-2 text-sm min-h-[100px] rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-[#F48F0F] transition"
            value={instructions}
            placeholder="Add assignment instructions here..."
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* Due Date */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 shadow-sm hover:shadow-md transition">
          <label className="block font-medium mb-2 text-sm">Due Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-700 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* File Upload Restrictions */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-3">File Upload Restrictions</h2>

          <select
            className="w-full mb-3 border px-3 py-2 rounded-lg dark:bg-zinc-700 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="">Select File Type</option>
            {fileTypeOptions.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">MAX File Size (MB)</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-700 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">MAX Number of Files</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-700 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-[#F48F0F] transition"
                value={fileCount}
                onChange={(e) => setFileCount(e.target.value)}
              />
            </div>
          </div>
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
            className="px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:opacity-90 transition flex items-center gap-1 shadow-md"
          >
            <Save size={16} /> Save Assignment
          </button>
        </div>
      </div>
    </Edu_layout>
  );
};

export default AssignmentForm;
