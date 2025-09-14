import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Link as LinkIcon, Pencil, Trash2, X } from "lucide-react";
import { allSubjectsData, coursesData } from "../../../../assets/CoursesData";
import Edu_layout from "../reusable/Edu_layout";
import Back from "../reusable/Back";

export default function CourseView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expandedChapters, setExpandedChapters] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [progress, setProgress] = useState(0);
    const [showAddChapterModal, setShowAddChapterModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState("");

    const role = localStorage.getItem("role") || "Student";
    const currentUser = localStorage.getItem("username") || "";
    const Course = coursesData.find(course => course.id === Number(id));
    
    // Check if current user is the course coordinator
    const isCoordinator = role === "Teacher" && Course?.coordinator === currentUser;

    useEffect(() => {
        const fetchedChapters = allSubjectsData[id || "1"] || [];
        setChapters(fetchedChapters);
    }, [id]);

    useEffect(() => {
        calculateProgress();
    }, [chapters]);

    const toggleExpanded = (id) => {
        setExpandedChapters((prev) =>
            prev.includes(id) ? prev.filter((chapterId) => chapterId !== id) : [...prev, id]
        );
    };

    const toggleTopic = (chapterId, topicId) => {
        setChapters((prev) =>
            prev.map((chapter) =>
                chapter.id === chapterId
                    ? {
                        ...chapter,
                        content: chapter.content.map((item) =>
                            item.id === topicId ? { ...item, completed: !item.completed } : item
                        ),
                    }
                    : chapter
            )
        );
    };

    const calculateProgress = () => {
        let total = 0, completed = 0;
        chapters.forEach((chapter) => {
            chapter.content.forEach((item) => {
                total++;
                if (item.completed) completed++;
            });
        });
        setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
    };

    const handleAddChapter = () => {
        if (!newChapterTitle.trim()) return;
        const newId = Math.max(...chapters.map(c => c.id)) + 1;
        const newChapter = { id: newId, title: newChapterTitle.trim(), content: [] };
        setChapters(prev => [...prev, newChapter]);
        setNewChapterTitle("");
        setShowAddChapterModal(false);
    };

    return (
        <Edu_layout>
            <div className="p-3 font-poppins text-[#292929] dark:text-white dark:bg-[#1a1a1a] bg-[#FDF8F3] min-h-screen">
                <Back />
                <h1 className="text-2xl font-semibold">{Course?.name || "Unknown Course"}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{Course?.desc}</p>
                
                {/* Course Coordinator Info */}
                {role === "Teacher" && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Course Coordinator: {Course?.coordinator}
                            </span>
                            {isCoordinator && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                    You
                                </span>
                            )}
                        </div>
                        {!isCoordinator && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Only the course coordinator can add/edit assignments and videos
                            </p>
                        )}
                    </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Overall Progress: {progress}%</p>
                    <div className="w-80 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="bg-orange-500 h-full text-white text-xs text-center transition-all duration-300 ease-in-out"
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 2 ? `${progress}%` : ""}
                        </div>
                    </div>
                </div>

                {/* Chapters */}
                <div className="flex justify-center">
                    <div className="w-full max-w-[1040px] space-y-4">
                        {chapters.map((chapter) => {
                            const isOpen = expandedChapters.includes(chapter.id);
                            return (
                                <div
                                    key={chapter.id}
                                    className="border rounded-xl bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm"
                                >
                                    <div
                                        onClick={() => toggleExpanded(chapter.id)}
                                        className="cursor-pointer flex justify-between items-center px-4 py-3 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-[#333]"
                                    >
                                        <div className="flex items-center gap-2">
                                            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            <span>{chapter.title}</span>
                                        </div>
                                        {isCoordinator && (
                                            <div className="flex items-center gap-2">
                                                <button className="text-red-500 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`px-4 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] pb-4" : "max-h-0 overflow-hidden"}`}>
                                        {chapter.content.map((topic) => (
                                            <div key={topic.id} className="border-b border-gray-200 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ml-6">
                                                <div className="flex items-center gap-2">
                                                    {role === "Student" && (
                                                        <input
                                                            type="checkbox"
                                                            checked={topic.completed}
                                                            onChange={() => toggleTopic(chapter.id, topic.id)}
                                                            className="w-4 h-4 accent-orange-500"
                                                        />
                                                    )}
                                                    <span>
                                                        {topic.type === "Assignment"
                                                            ? `📝 Assignment: ${topic.title}`
                                                            : `📂 ${topic.title}`}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    {topic.dueDate && (
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            Due: {new Date(topic.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {topic.type === "Assignment" ?
                                                        (
                                                            role === "Teacher" ? (
                                                                <button
                                                                    onClick={() => navigate(`/Education/Teacher/Course/${id}/Module/${chapter.id}/ViewAssignment/${topic.id}`)}
                                                                    className="text-white bg-orange-500 px-3 py-1 rounded-full hover:bg-orange-600"
                                                                >
                                                                    View Submissions
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => navigate(`/Education/Student/Course/${id}/Module/${chapter.id}/Assignment/${topic.id}`)}
                                                                    className="text-white bg-orange-500 px-3 py-1 rounded-full hover:bg-orange-600"
                                                                >
                                                                    Add Submission
                                                                </button>
                                                            )
                                                        ) : topic.type === "Video" && topic.link ? (
                                                            <a
                                                                href={topic.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-white bg-orange-500 px-3 py-1 rounded-full hover:bg-orange-600 flex items-center gap-1"
                                                            >
                                                                <LinkIcon size={14} />
                                                                Watch Video
                                                            </a>
                                                        ) : null}

                                                    {isCoordinator && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    topic.type === "Assignment"
                                                                        ? navigate(`/Education/Teacher/Course/${id}/Module/${chapter.id}/Assignment/${topic.id}`)
                                                                        : navigate(`/Education/Teacher/Course/${id}/Module/${chapter.id}/Video/${topic.id}`);
                                                                }}
                                                                className="text-orange-500 hover:text-orange-600"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button className="text-red-500 hover:text-red-600">
                                                                <Trash2 size={16} />
                                                            </button>


                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Coordinator-only Add Buttons */}
                                        {isCoordinator && (
                                            <div className="flex flex-col sm:flex-row gap-4 mt-4 ml-6 text-sm">
                                                <button
                                                    className="text-[#292929] dark:text-white hover:underline flex items-center gap-1"
                                                    onClick={() => navigate(`/Education/Teacher/Course/${id}/Module/${chapter.id}/Video/new`)}
                                                >
                                                    ➕ Add Topic
                                                </button>
                                                <button
                                                    className="text-[#292929] dark:text-white hover:underline flex items-center gap-1"
                                                    onClick={() => navigate(`/Education/Teacher/Course/${id}/Module/${chapter.id}/Assignment/new`)}
                                                >
                                                    ➕ Add Assignment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Chapter Button - Coordinator Only */}
                        {isCoordinator && (
                            <button
                                onClick={() => setShowAddChapterModal(true)}
                                className="mt-6 w-full flex items-center justify-center gap-2 text-lg font-medium text-[#292929] dark:text-white py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-[#333] transition"
                            >
                                ➕ Add Chapter
                            </button>
                        )}
                    </div>
                </div>

                {/* Add Chapter Modal */}
                {showAddChapterModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#2a2a2a] p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Add New Chapter</h2>
                                <button onClick={() => setShowAddChapterModal(false)} className="text-gray-500 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                placeholder="Enter chapter title"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-white focus:outline-none"
                            />
                            <button
                                onClick={handleAddChapter}
                                className="bg-orange-500 text-white w-full py-2 rounded-md hover:bg-orange-600"
                            >
                                Add Chapter
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Edu_layout>
    );
}
