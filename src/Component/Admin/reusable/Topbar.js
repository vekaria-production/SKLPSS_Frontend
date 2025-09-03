import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../Context/Auth/AuthContext";
const Topbar = () => {
  const { logout} = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/Adminlogin"), 0);
  };

  return (
    <header className="bg-[#FDF8F3] border-b border-[#E1D5C9] px-4 py-1 font-poppins">
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Left: Logo + Title */}
        <div className="flex items-center flex-wrap gap-0 md:gap-4">
          <img
            src={logo}
            alt="Logo"
            className="h-[8vw] max-h-20 min-h-[4rem] transition-all duration-300"
          />
          <div className="md:text-2xl font-semibold ml-2">
            SKLPSS Admin Panel
          </div>
        </div>

        {/* Right: Admin Info + Logout */}
        <div className="relative group text-base font-medium mt-4 md:mt-0">
          <div className="flex items-center cursor-pointer md:pr-10">
            <span className="text-xl pr-2">👤</span>
            <span>{userName}</span>
          </div>

          <div className="absolute right-0 mt-0 bg-white border border-[#E1D5C9] rounded shadow-md p-2 text-sm hidden group-hover:block z-10 transition">
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
