import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";

const Edu_Topbar = ({ currentUser }) => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("lastActive");
    navigate("/Education/Login");
  };

  return (
    <header className="bg-[#FDF8F3] dark:bg-[#1A1A1A] border-b border-[#E1D5C9] dark:border-[#333] px-4 py-1 font-poppins transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src={logo}
            alt="Logo"
            className="h-[8vw] max-h-20 min-h-[4rem] transition-all duration-300"
          />
          <div className="md:text-2xl font-semibold text-[#292929] dark:text-white">
            SKLPSS Education Portal
          </div>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative group text-base font-medium">
            <div className="flex items-center cursor-pointer md:pr-10 text-[#292929] dark:text-white">
              <span className="text-xl pr-2">👤</span>
              <span>{currentUser?.name || "Student"}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 capitalize">
                ({localStorage.getItem("role") || "user"})
              </span>
            </div>

            {/* Logout Dropdown */}
            <div className="absolute right-0 bg-white dark:bg-[#2C2C2C] border border-[#E1D5C9] dark:border-[#444] rounded shadow-md p-2 text-sm hidden group-hover:block z-10 transition">
              <button
                onClick={handleLogout}
                className="hover:text-red-600 dark:hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Optional: Dark Mode Toggle */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="text-[#292929] dark:text-white text-sm border px-3 py-1 rounded-md border-[#E1D5C9] dark:border-[#444] hover:bg-[#F2E6DA] dark:hover:bg-[#333] transition"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Edu_Topbar;
