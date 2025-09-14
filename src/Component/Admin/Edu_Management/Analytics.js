import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Award, Download } from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - replace with actual API calls
  const analyticsData = {
    overview: {
      totalStudents: 156,
      totalTeachers: 12,
      totalSubjects: 9,
      activeAssignments: 24,
      completionRate: 78,
      averageGrade: 85
    },
    studentProgress: [
      { subject: "Math Basics", enrolled: 28, completed: 24, completionRate: 86 },
      { subject: "Physics", enrolled: 25, completed: 23, completionRate: 92 },
      { subject: "Gujarati", enrolled: 18, completed: 14, completionRate: 78 },
      { subject: "Computer Science", enrolled: 22, completed: 18, completionRate: 82 }
    ],
    teacherPerformance: [
      { teacher: "Mr. Sharma", subjects: 2, students: 32, avgGrade: 88, rating: 4.8 },
      { teacher: "Ms. Patel", subjects: 1, students: 25, avgGrade: 92, rating: 4.9 },
      { teacher: "Mr. Bhatt", subjects: 1, students: 18, avgGrade: 85, rating: 4.6 },
      { teacher: "Ms. Desai", subjects: 1, students: 22, avgGrade: 87, rating: 4.7 }
    ],
    monthlyStats: [
      { month: "Jan", students: 120, assignments: 15, completions: 12 },
      { month: "Feb", students: 135, assignments: 18, completions: 16 },
      { month: "Mar", students: 142, assignments: 22, completions: 19 },
      { month: "Apr", students: 156, assignments: 24, completions: 21 }
    ]
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {change && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp size={14} />
              +{change}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = "bg-[#F48F0F]" }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-600 dark:text-gray-300">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#292929] dark:text-white">
          Analytics & Reports
        </h2>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={analyticsData.overview.totalStudents}
          icon={<Users size={24} className="text-blue-600" />}
          color="text-blue-600"
          change="12"
        />
        <StatCard
          title="Total Teachers"
          value={analyticsData.overview.totalTeachers}
          icon={<Award size={24} className="text-green-600" />}
          color="text-green-600"
          change="8"
        />
        <StatCard
          title="Active Subjects"
          value={analyticsData.overview.totalSubjects}
          icon={<BookOpen size={24} className="text-purple-600" />}
          color="text-purple-600"
          change="5"
        />
        <StatCard
          title="Completion Rate"
          value={`${analyticsData.overview.completionRate}%`}
          icon={<TrendingUp size={24} className="text-orange-600" />}
          color="text-orange-600"
          change="3"
        />
        <StatCard
          title="Average Grade"
          value={analyticsData.overview.averageGrade}
          icon={<BarChart3 size={24} className="text-red-600" />}
          color="text-red-600"
          change="2"
        />
        <StatCard
          title="Active Assignments"
          value={analyticsData.overview.activeAssignments}
          icon={<Calendar size={24} className="text-indigo-600" />}
          color="text-indigo-600"
          change="15"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Progress by Subject */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">
            Student Progress by Subject
          </h3>
          <div className="space-y-4">
            {analyticsData.studentProgress.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{subject.subject}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{subject.completionRate}%</span>
                </div>
                <ProgressBar
                  label={`${subject.completed} completed`}
                  value={subject.completed}
                  max={subject.enrolled}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Performance */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">
            Teacher Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.teacherPerformance.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">{teacher.teacher}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {teacher.subjects} subjects • {teacher.students} students
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#F48F0F]">{teacher.avgGrade}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ⭐ {teacher.rating}/5
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">
            Monthly Growth
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.monthlyStats.map((month, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300">{month.month}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Students:</span>
                    <span className="font-semibold text-[#F48F0F]">{month.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Assignments:</span>
                    <span className="font-semibold text-blue-600">{month.assignments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Completions:</span>
                    <span className="font-semibold text-green-600">{month.completions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
