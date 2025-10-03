import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Eye, Clock, CheckCircle, XCircle, User, FileText, Calendar } from "lucide-react";
import { allSubjectsData, coursesData } from "../../../../assets/CoursesData";
import Edu_layout from "../reusable/Edu_layout";
import Back from "../reusable/Back";

export default function Submission() {
    const { courseid, chapterid, assignmentid } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submittedStudents, setSubmittedStudents] = useState([]);
    const [notSubmittedStudents, setNotSubmittedStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock student data - in real app, this would come from API
    const mockStudents = [
        { id: 1, name: "John Doe", email: "john@example.com", studentId: "STU001" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", studentId: "STU002" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", studentId: "STU003" },
        { id: 4, name: "Sarah Wilson", email: "sarah@example.com", studentId: "STU004" },
        { id: 5, name: "David Brown", email: "david@example.com", studentId: "STU005" },
        { id: 6, name: "Lisa Davis", email: "lisa@example.com", studentId: "STU006" },
        { id: 7, name: "Tom Anderson", email: "tom@example.com", studentId: "STU007" },
        { id: 8, name: "Emma Taylor", email: "emma@example.com", studentId: "STU008" },
    ];

    // Mock submission data - in real app, this would come from API
    const mockSubmissions = [
        {
            id: 1,
            studentId: 1,
            assignmentId: assignmentid,
            submittedAt: "2025-01-15T10:30:00Z",
            files: [
                { name: "assignment1.pdf", size: "2.5MB", url: "#" },
                { name: "screenshot1.png", size: "1.2MB", url: "#" }
            ],
            status: "submitted",
            grade: null,
            feedback: ""
        },
        {
            id: 2,
            studentId: 2,
            assignmentId: assignmentid,
            submittedAt: "2025-01-15T14:20:00Z",
            files: [
                { name: "homework2.pdf", size: "3.1MB", url: "#" }
            ],
            status: "submitted",
            grade: 85,
            feedback: "Good work! Minor improvements needed in conclusion."
        },
        {
            id: 3,
            studentId: 3,
            assignmentId: assignmentid,
            submittedAt: "2025-01-16T09:15:00Z",
            files: [
                { name: "assignment3.docx", size: "1.8MB", url: "#" }
            ],
            status: "submitted",
            grade: null,
            feedback: ""
        },
        {
            id: 4,
            studentId: 4,
            assignmentId: assignmentid,
            submittedAt: "2025-01-16T16:45:00Z",
            files: [
                { name: "project4.pdf", size: "4.2MB", url: "#" },
                { name: "references.pdf", size: "0.8MB", url: "#" }
            ],
            status: "submitted",
            grade: 92,
            feedback: "Excellent work! Very thorough analysis."
        }
    ];

    useEffect(() => {
        loadAssignmentData();
        loadSubmissions();
    }, [courseid, chapterid, assignmentid]);

    const loadAssignmentData = () => {
        const course = coursesData.find(c => c.id === Number(courseid));
        if (course) {
            const chapters = allSubjectsData[courseid] || [];
            const chapter = chapters.find(ch => ch.id === Number(chapterid));
            if (chapter) {
                const assignmentData = chapter.content.find(item => 
                    item.id === assignmentid && item.type === "Assignment"
                );
                setAssignment(assignmentData);
            }
        }
    };

    const loadSubmissions = () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const submittedIds = mockSubmissions.map(sub => sub.studentId);
            const submitted = mockStudents.filter(student => submittedIds.includes(student.id));
            const notSubmitted = mockStudents.filter(student => !submittedIds.includes(student.id));
            
            setSubmittedStudents(submitted);
            setNotSubmittedStudents(notSubmitted);
            setLoading(false);
        }, 1000);
    };

    const getSubmissionForStudent = (studentId) => {
        return mockSubmissions.find(sub => sub.studentId === studentId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatFileSize = (size) => {
        return size;
    };

    const handleViewSubmission = (studentId) => {
        const submission = getSubmissionForStudent(studentId);
        if (submission) {
            // Navigate to submission detail view
            navigate(`/Education/Teacher/Course/${courseid}/Module/${chapterid}/Assignment/${assignmentid}/Submission/${submission.id}`);
        }
    };

    const handleDownloadFile = (file) => {
        // In real app, this would download the actual file
        console.log("Downloading file:", file.name);
    };

    if (loading) {
        return (
            <Edu_layout>
                <div className="p-3 font-poppins text-[#292929] dark:text-white dark:bg-[#1a1a1a] bg-[#FDF8F3] min-h-screen">
                    <Back />
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </Edu_layout>
        );
    }

    return (
        <Edu_layout>
            <div className="p-3 font-poppins text-[#292929] dark:text-white dark:bg-[#1a1a1a] bg-[#FDF8F3] min-h-screen">
                <Back />
                
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">Assignment Submissions</h1>
                    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {assignment?.title || "Unknown Assignment"}
                            </h2>
                            
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                                <span className="ml-2 text-gray-800 dark:text-gray-200">
                                    {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No due date"}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">File Type:</span>
                                <span className="ml-2 text-gray-800 dark:text-gray-200">
                                    {assignment?.file_type || "Any"}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Max Size:</span>
                                <span className="ml-2 text-gray-800 dark:text-gray-200">
                                    {assignment?.max_size ? `${assignment.max_size}MB` : "No limit"}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Max Files:</span>
                                <span className="ml-2 text-gray-800 dark:text-gray-200">
                                    {assignment?.max_files || "No limit"}
                                </span>
                            </div>
                        </div>
                        {assignment?.instructions && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Instructions:</span>
                                <p className="text-gray-800 dark:text-gray-200 text-sm mt-1 whitespace-pre-line">
                                    {assignment.instructions}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                                <p className="text-xl font-semibold">{submittedStudents.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Not Submitted</p>
                                <p className="text-xl font-semibold">{notSubmittedStudents.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                                <p className="text-xl font-semibold">{mockStudents.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submitted Students Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold">Submitted Students ({submittedStudents.length})</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {submittedStudents.map((student) => {
                            const submission = getSubmissionForStudent(student.id);
                            return (
                                <div key={student.id} className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{student.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">ID: {student.studentId}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Submitted: {formatDate(submission.submittedAt)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    {submission.files.length} file(s)
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewSubmission(student.id)}
                                                    className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors"
                                                    title="View Submission"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                
                                                {submission.files.map((file, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDownloadFile(file)}
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                                        title={`Download ${file.name}`}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Files List */}
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-wrap gap-2">
                                            {submission.files.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                                                    <FileText className="w-3 h-3" />
                                                    <span>{file.name}</span>
                                                    <span className="text-gray-500 dark:text-gray-400">({file.size})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Grade and Feedback */}
                                    {submission.grade && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Grade:</span>
                                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
                                                    {submission.grade}%
                                                </span>
                                            </div>
                                            {submission.feedback && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {submission.feedback}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Not Submitted Students Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-semibold">Not Submitted Students ({notSubmittedStudents.length})</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {notSubmittedStudents.map((student) => (
                            <div key={student.id} className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm border border-red-200 dark:border-red-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{student.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">ID: {student.studentId}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-red-500 dark:text-red-400" />
                                        <span className="text-sm text-red-600 dark:text-red-400">Not Submitted</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Edu_layout>
    );
}
