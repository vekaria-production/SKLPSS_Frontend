import Edu_layout from "../reusable/Edu_layout";
import { coursesData } from "../../../../assets/CoursesData";
import { useNavigate } from "react-router-dom";

const Teacher_Dash = () => {
    const navigate=useNavigate();
    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });



    return (
        <Edu_layout>
            <div className="bg-[#FDF8F3] dark:bg-[#1a1a1a] px-4 py-6 space-y-6 text-[#292929] dark:text-white">

                {/* Greeting Bar */}
                <div className="bg-[#FFEBD8] dark:bg-[#2a2a2a] rounded-xl flex items-center justify-between p-4 shadow-sm">
                    <div>
                        <h2 className="text-xl font-semibold">Hello, Mr Patel... 👋</h2>
                        <p className="text-sm mt-1 text-[#555] dark:text-[#ccc]">
                            “Today is a good day to inspire learning.”
                        </p>
                    </div>
                    <div className="text-sm font-medium">{today}</div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mr-8 ml-8">
                    <div className="bg-white dark:bg-[#2a2a2a] min-h-[140px] rounded-xl p-10 text-center shadow-sm">
                        <h3 className="text-2xl font-bold">32</h3>
                        <p className="mt-1 text-sm text-[#555] dark:text-[#ccc]">Pending Evaluations</p>
                    </div>
                    <div className="bg-white dark:bg-[#2a2a2a] min-h-[140px] rounded-xl p-10 text-center shadow-sm">
                        <h3 className="text-2xl font-bold">48</h3>
                        <p className="mt-1 text-sm text-[#555] dark:text-[#ccc]">Students Learning</p>
                    </div>
                    <div className="bg-white dark:bg-[#2a2a2a] min-h-[140px] rounded-xl p-10 text-center shadow-sm">
                        <h3 className="text-2xl font-bold">4</h3>
                        <p className="mt-1 text-sm text-[#555] dark:text-[#ccc]">Subjects Assigned</p>
                    </div>
                </div>

                {/* Subjects Section */}

                <h1 className="dark:text-white text-lg font-bold">Recently accessed Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

export default Teacher_Dash;
