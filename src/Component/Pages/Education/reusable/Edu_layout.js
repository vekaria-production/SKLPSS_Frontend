import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Menu,
  X,
  Settings as SettingsIcon,
  BookOpenCheck,
  ClipboardList,
} from "lucide-react"; // Add more icons as needed
import Edu_Topbar from "./Edu_Topbar";

const Edu_layout = ({ children }) => {
//   const currentUser = {
//     id: 1,
//     name: "Mr. Sharma",
//     role: "Teacher", // Change this for testing
//   };
  // Test different user scenarios by changing this object
  const currentUser = {
    id: 1,
    name: "Mr. Sharma",
    role: "Teacher", // Change to "Student" to test student view
    isCoordinator: true, // Set to false to test regular teacher
    coordinatorOf: ["Math Basics", "Physics Fundamentals"], // Courses they coordinate
    assignedCourses: ["Math Basics", "Physics Fundamentals", "Gujarati Grammar"] // All assigned courses
  };

  // Debug logging
  console.log("=== EDU LAYOUT DEBUG ===");
  console.log("Current User:", currentUser);
  console.log("Is Coordinator:", currentUser.isCoordinator);
  console.log("Coordinated Courses:", currentUser.coordinatorOf);
  console.log("Role check (Teacher):", currentUser.role === "Teacher" || currentUser.role === "teacher");
  console.log("=========================");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#FDF8F3] dark:bg-[#1a1a1a] text-[#292929] dark:text-white font-poppins">
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed z-50 top-[70px] left-2 p-2 rounded-full bg-[#F48F0F] text-white shadow-lg sm:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      <Edu_Topbar currentUser={currentUser} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed sm:static top-0 left-0 h-full z-50 shadow-md border-r
          transition-all duration-300 ease-in-out
          bg-[#F2E6DA] dark:bg-[#2a2a2a] border-[#E1D5C9] dark:border-[#444]
          ${isMobile
            ? isCollapsed
              ? "-translate-x-full w-64"
              : "translate-x-0 w-64"
            : isCollapsed
              ? "w-16"
              : "w-64"
          }
          flex flex-col`}
        >
          <div className={`flex p-3 sm:p-2 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-end'}`}>
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 px-2 mt-2 sm:mt-4">
            {currentUser.role === "Teacher" || currentUser.role === "teacher" ? (
              <>
                <SidebarLink
                  icon={<Home />}
                  label="Dashboard"
                  to="/Education/Teacher"
                  collapsed={isCollapsed && !isMobile}
                  isMobile={isMobile}
                  setIsCollapsed={setIsCollapsed}
                />
                <SidebarLink
                  icon={<BookOpenCheck />}
                  label="Assigned Courses"
                  to="/Education/Teacher/Courses"
                  collapsed={isCollapsed && !isMobile}
                  isMobile={isMobile}
                  setIsCollapsed={setIsCollapsed}
                />
              </>
            ) : (
              <>
                <SidebarLink
                  icon={<Home />}
                  label="Dashboard"
                  to="/Education/Student"
                  collapsed={isCollapsed && !isMobile}
                  isMobile={isMobile}
                  setIsCollapsed={setIsCollapsed}
                />
                <SidebarLink
                  icon={<Calendar />}
                  label="My Courses"
                  to="/Education/Student/Courses"
                  collapsed={isCollapsed && !isMobile}
                  isMobile={isMobile}
                  setIsCollapsed={setIsCollapsed}
                />
                <SidebarLink
                  icon={<SettingsIcon />}
                  label="Settings"
                  to="/Education/Student/Settings"
                  collapsed={isCollapsed && !isMobile}
                  isMobile={isMobile}
                  setIsCollapsed={setIsCollapsed}
                />
              </>
            )}
          </nav>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

const SidebarLink = ({
  icon,
  label,
  to,
  collapsed,
  isMobile,
  setIsCollapsed,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = () => {
    if (isMobile) setIsCollapsed(true);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${isActive
          ? "bg-[#F48F0F] text-[#292929] dark:text-white font-semibold"
          : "hover:bg-[#FDF8F3] dark:hover:bg-[#333]"
        }`}
    >
      <div>{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default Edu_layout;
