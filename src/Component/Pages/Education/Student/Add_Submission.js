import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Edu_layout from "../reusable/Edu_layout";
import EBack from "../reusable/Back"
import { coursesData, allSubjectsData } from "../../../../assets/CoursesData";

export default function AssignmentUpload() {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const { courseid, chapterid, Assignmentid } = useParams();
    const navigate = useNavigate();

    // Lookup Logic
    const course = coursesData.find((c) => c.id === parseInt(courseid));
    const subjectTitle = course?.name || "Unknown";

    const moduleData = allSubjectsData[courseid]?.find(
        (m) => m.id === parseInt(chapterid)
    );

    const foundAssignment = moduleData?.content.find(
        (item) => item.id === Assignmentid && item.type.toLowerCase() === "assignment"
    );

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) setFileName(file.name);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFileName(file.name);
    };

    const handleCancel = () => {
        alert("Assignment upload canceled.");
        navigate(-1);
    };

    const handleSubmit = () => {
        if (!fileName) {
            alert("Please select a file before submitting.");
        } else {
            alert(
                `Submitted successfully!\nAssignment: ${foundAssignment?.title}\nFile: ${fileName}`
            );
        }
        navigate(-1);
    };

    return (
        <Edu_layout>
            <div className="min-h-full px-4 bg-[#FDF8F3] dark:bg-[#1a1a1a] transition-colors duration-300">
                <EBack />

                {/* Subject Header */}
                <h2 className="text-2xl font-semibold text-[#1a1a1a] dark:text-white mb-6">
                    {subjectTitle}
                </h2>

                {/* Instructions Box */}
                {foundAssignment ? (
                    <div className="bg-[#eeeeee] dark:bg-[#2b2b2b] rounded-xl p-6 mb-6 text-[#1a1a1a] dark:text-gray-200">
                        <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                            {foundAssignment.instructions
                                ?.split(/\n|\.: /)
                                .filter((line) => line.trim().length > 0)
                                .map((line, i) => {
                                    const trimmed = line.trim();
                                    const isLink = /(https?:\/\/[^\s]+)/.test(trimmed);

                                    if (isLink) {
                                        const url = trimmed.match(/(https?:\/\/[^\s]+)/)[0];
                                        return (
                                            <li key={i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline dark:text-blue-400"
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        );
                                    } else {
                                        return <li key={i}>{trimmed}</li>;
                                    }
                                })}
                        </ul>
                    </div>
                ) : (
                    <p className="text-red-500 mb-6">Assignment not found.</p>
                )}

                {/* Upload Box */}
                <div
                    className="bg-white dark:bg-[#2b2b2b] rounded-xl p-10 flex flex-col items-center justify-center border border-dashed border-gray-400 dark:border-gray-600 mb-6 text-[#1a1a1a] dark:text-gray-200 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-[#333]"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current.click();
                        }}
                        className="bg-[#F48F0F] text-white px-4 py-1 rounded-md text-sm hover:bg-orange-600 transition"
                    >
                        Browse
                    </button>

                    <p className="text-sm mt-2">OR Drop Here</p>

                    {fileName && (
                        <p className="text-sm mt-4 text-center">
                            <span className="font-medium">Selected:</span> {fileName}
                        </p>
                    )}
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        className="bg-white dark:bg-transparent border border-[#F48F0F] text-[#1a1a1a] dark:text-white px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#F48F0F] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </Edu_layout>
    );
}
