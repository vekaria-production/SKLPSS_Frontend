import React from "react";
import Edu_layout from "../reusable/Edu_layout";
import img from "./image.png";
import { coursesData } from "../../../../assets/CoursesData";
import { useNavigate } from "react-router-dom";
import { allSubjectsData } from "../../../../assets/CoursesData";


const getUpcomingAssignments = () => {
  const upcoming = [];

  for (const [subjectId, modules] of Object.entries(allSubjectsData)) {
    const course = coursesData.find(c => String(c.id) === subjectId);
    const subjectName = course?.name || "Unknown Subject";

    for (const module of modules) {
      for (const item of module.content) {
        if (item.type === "assignment" && !item.submitted) {
          upcoming.push({
            id: item.id,
            title: item.title,
            dueDate: item.dueDate,
            subject: subjectName,
          });
        }
      }
    }
  }

  // Sort by due date ascending
  return upcoming
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);
};



export default function StudentDashboard() {

  const navigate = useNavigate();
  const assignments = getUpcomingAssignments();

  return (
    <Edu_layout>
      <div className="bg-[#FDF8F3] dark:bg-[#121212] min-h-screen p-4 sm:p-6 transition-colors duration-300">
        {/* Welcome Banner */}
        <div className="bg-[#FFEFD8] dark:bg-[#1e1e1e] rounded-2xl p-6 sm:pr-24 flex flex-col sm:flex-row items-center justify-between shadow mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold leading-snug text-[#292929] dark:text-white">
              Welcome Back<br />Yagnik!
            </h2>
            <p className="text-sm mt-2 text-[#292929]/80 dark:text-gray-400">
              Here’s what’s new in your learning journey!
            </p>
          </div>
          <img src={img} alt="Learning" className="h-24 w-auto mt-4 sm:mt-0" />
        </div>

        {/* Recently Accessed Courses */}
        <div className="rounded-2xl px-2 sm:px-6 py-6 mt-4">
          <h2 className="text-2xl font-semibold mb-6 text-[#292929] dark:text-white text-center sm:text-left">
            Recently accessed courses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
            {coursesData.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-[#1a1a1a] border border-[#E1D5C9] dark:border-[#333] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-sm duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_10px_rgba(244,143,15,0.4)]"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#292929] dark:text-white">
                    {course.name}
                  </h3>
                  <p className="text-sm text-[#292929] dark:text-gray-300">
                    {course.teacher}
                  </p>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => navigate(`/Education/Student/Course/${course.id}`)}
                    className="bg-[#F48F0F] text-[#292929] text-sm px-4 py-2 rounded-md hover:bg-white hover:text-[#F48F0F] dark:hover:bg-[#333] dark:hover:text-white border border-transparent transition-all duration-300 ease-in-out"
                  >
                    Start Learning
                  </button>
                  <button onClick={() => alert("Under development")} className="bg-[#F48F0F] text-[#292929] text-sm px-4 py-2 rounded-md hover:bg-white hover:text-[#F48F0F] dark:hover:bg-[#333] dark:hover:text-white border border-transparent transition-all duration-300 ease-in-out">
                    Take a Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-[#292929] dark:text-white mb-4 text-center sm:text-left">
            Upcoming Assignments
          </h3>
          <div className="space-y-4">
            {assignments.map((assignment, idx) => (
              <div
                key={idx}
                className="bg-[#FFEFD8] dark:bg-[#1e1e1e] rounded-xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(244,143,15,0.4)] transition-transform"
              >
                {/* Title & Subject */}
                <div className="flex-1 min-w-[150px]">
                  <h4 className="font-bold text-lg text-[#292929] dark:text-white">
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-[#292929]/80 dark:text-gray-400">
                    {assignment.subject}
                  </p>
                </div>

                {/* Due Date */}
                <div className="flex-1 text-center sm:text-left flex flex-col justify-center items-center sm:items-start text-[#292929] dark:text-gray-200">
                  <p className="text-sm font-semibold">Due :</p>
                  <p className="text-sm">{assignment.dueDate}</p>
                  <p className="text-sm">{assignment.dueTime}</p>
                </div>

                {/* Action Button */}
                <div className="flex-1 flex justify-center sm:justify-end">
                  <button
                    onClick={() => navigate(`/Education/Student/Assignment/${assignment.id}`)}
                    className="bg-[#F48F0F] text-[#292929] text-sm px-4 py-2 rounded-md font-medium hover:bg-[#e1810c] dark:hover:bg-[#333] dark:hover:text-white transition duration-300 ease-in-out"
                  >
                    Add Submission
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Edu_layout>
  );
}
