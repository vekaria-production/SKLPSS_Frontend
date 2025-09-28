import React, { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, BarChart3, Plus, Search, Filter } from "lucide-react";
import SidebarLayout from "../reusable/SidebarLayout";
import StudentManagement from "./StudentManagement";
import TeacherManagement from "./TeacherManagement";
import SubjectManagement from "./SubjectManagement";

const Edu_manage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalStudents: 156,
    totalTeachers: 12,
    totalSubjects: 9,
    activeAssignments: 24,
    completedAssignments: 89,
    pendingSubmissions: 15
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={20} /> },
    { id: "students", label: "Students", icon: <GraduationCap size={20} /> },
    { id: "teachers", label: "Teachers", icon: <Users size={20} /> },
    { id: "subjects", label: "Subjects", icon: <BookOpen size={20} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentManagement searchTerm={searchTerm} filterRole={filterRole} />;
      case "teachers":
        return <TeacherManagement searchTerm={searchTerm} filterRole={filterRole} />;
      case "subjects":
        return <SubjectManagement searchTerm={searchTerm} />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-[#FDF8F3] dark:bg-[#1a1a1a] min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#292929] dark:text-white mb-2">
            Education Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage students, teachers, subjects, and assignments
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
            </select>
            <button className="px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${
                  activeTab === tab.id
                    ? "bg-[#F48F0F] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#F48F0F] hover:bg-[#F48F0F]/10"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </SidebarLayout>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <GraduationCap size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: <Users size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Active Subjects",
      value: stats.totalSubjects,
      icon: <BookOpen size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Active Assignments",
      value: stats.activeAssignments,
      icon: <BookOpen size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Completed Assignments",
      value: stats.completedAssignments,
      icon: <BookOpen size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Pending Submissions",
      value: stats.pendingSubmissions,
      icon: <BookOpen size={24} className="text-[#F48F0F]" />,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#292929] dark:text-white mb-6">
        System Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-lg border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#F48F0F] hover:bg-[#F48F0F]/5 transition">
            <Plus size={20} className="text-[#F48F0F]" />
            <span className="text-sm font-medium">Add Student</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#F48F0F] hover:bg-[#F48F0F]/5 transition">
            <Plus size={20} className="text-[#F48F0F]" />
            <span className="text-sm font-medium">Add Teacher</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#F48F0F] hover:bg-[#F48F0F]/5 transition">
            <Plus size={20} className="text-[#F48F0F]" />
            <span className="text-sm font-medium">Add Subject</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#F48F0F] hover:bg-[#F48F0F]/5 transition">
            <BarChart3 size={20} className="text-[#F48F0F]" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edu_manage;
