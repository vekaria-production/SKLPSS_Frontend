import { useNavigate } from "react-router-dom";
import Edu_layout from "../reusable/Edu_layout";
import { coursesData } from "../../../../assets/CoursesData"; 

const AssignedCourses = () => {
    const navigate = useNavigate();

    return (
        <Edu_layout>
            <div className="bg-[#FDF8F3] dark:bg-[#1a1a1a] px-6 py-8 text-[#292929] dark:text-white ">
                <h1 className="text-2xl font-bold mb-6">Assigned Courses</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coursesData.map((subject, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-4 shadow-sm dark:shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#292929] dark:text-white">{subject.name}</h2>
                                    {subject.code && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{subject.code}</p>
                                    )}
                                </div>
                            </div>

                            <ul className="text-sm space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                                <li>🧑‍🏫 Students Enrolled: {subject.students}</li>
                                <li>📄 Assignments: {subject.assignments}</li>
                                <li>👨‍💼 Coordinator: {subject.coordinator}</li>
                                <li className="flex flex-col">
                                    <span>👨‍🏫 Teachers:</span>
                                    <div className="ml-4 mt-1">
                                        {subject.teachers && subject.teachers.length > 0 ? (
                                            <ul className="space-y-1">
                                                {subject.teachers.map((teacher, teacherIndex) => (
                                                    <li key={teacherIndex} className="text-xs text-gray-600 dark:text-gray-400">
                                                        • {teacher}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-xs text-gray-500 dark:text-gray-500">No teachers assigned</span>
                                        )}
                                    </div>
                                </li>
                                <li>📅 Last Updated: {subject.lastUpdated || "N/A"}</li>
                            </ul>

                            <button
                                className="w-full bg-[#F48F0F] hover:opacity-90 text-white py-2 px-4 rounded-md font-medium"
                                onClick={() => navigate(`/Education/Teacher/Course/${subject.id}`)}
                            >
                                Go to Subject
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Edu_layout>
    );
};

export default AssignedCourses;
