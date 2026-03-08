import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Image,
  Users,
  Menu,
  X,
  Settings as SettingsIcon,
  BookOpen,
  FileText,
  Presentation,
  TicketCheck,
  UserPlus,
} from "lucide-react";
import Topbar from "./Topbar";
import { useAuth } from "../../../Context/Auth/AuthContext";
const currentUser = { id: 1, name: "Yagnik", role: "admin" }; // Replace with auth context later

const SidebarLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  const { permissions } = useAuth();
  const hasPermission = (field) => permissions.includes(`${field}`);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#FDF8F3] font-poppins">
      {/* Floating menu toggle button for mobile only */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed z-50 top-[70px] left-2 p-2 rounded-full bg-[#F48F0F] text-white shadow-lg sm:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      <Topbar />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed sm:static top-0 left-0 h-full bg-[#F2E6DA] border-r border-[#E1D5C9] shadow-md z-50
            transition-all duration-300 ease-in-out
            ${isMobile
              ? isCollapsed
                ? "-translate-x-full w-64"
                : "translate-x-0 w-64"
              : isCollapsed
                ? "w-16"
                : "w-64"
            }
            flex flex-col
          `}
        >
          {/* Top toggle button */}
          <div className="flex justify-end p-3 sm:p-2">
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex flex-col gap-2 px-2 mt-2 sm:mt-4">
            <SidebarLink
              icon={<Home />}
              label="Dashboard"
              to="/Admin"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            {hasPermission("view_events") && (
              <SidebarLink
                icon={<Calendar />}
                label="Events"
                to="/Admin/events"
                collapsed={isCollapsed && !isMobile}
                isMobile={isMobile}
                setIsCollapsed={setIsCollapsed}
              />
            )}
            {hasPermission("view_gallery") && (
              <SidebarLink
                icon={<Image />}
                label="Gallery"
                to="/Admin/Gallery"
                collapsed={isCollapsed && !isMobile}
                isMobile={isMobile}
                setIsCollapsed={setIsCollapsed}
              />
            )}

            <SidebarLink
              icon={<Users />}
              label="Members"
              to="/Admin/Members"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            {/* <SidebarLink
              icon={<BookOpen />}
              label="Education"
              to="/Admin/Education"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            /> */}

            <SidebarLink
              icon={<FileText />}
              label="Documents"
              to="/Admin/Document-Management"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            <SidebarLink
              icon={<UserPlus />}
              label="Registration"
              to="/Admin/Register-User"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            <SidebarLink
              icon={<TicketCheck />}
              label="Check-In"
              to="/Admin/Event-Registration"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            <SidebarLink
              icon={<Presentation />}
              label="Meetings"
              to="/Admin/Meeting-Notes-Management"
              collapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
            />
            {currentUser.role === "admin" && (
              <SidebarLink
                icon={<SettingsIcon />}
                label="Settings"
                to="/Admin/settings"
                collapsed={isCollapsed && !isMobile}
                isMobile={isMobile}
                setIsCollapsed={setIsCollapsed}
              />
            )}
          </nav>
        </div>

        {/* Main Content Area */}
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
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive
          ? "bg-[#F48F0F]/50 text-[#292929] font-semibold"
          : "hover:bg-[#FDF8F3]"
        }`}
    >
      <div>{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default SidebarLayout;
