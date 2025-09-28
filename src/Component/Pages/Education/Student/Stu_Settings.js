import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Edu_layout from '../reusable/Edu_layout';
import ChangePasswordModal from '../reusable/ChangePasswordModal';
import DarkModeToggle from '../reusable/Darkmodetoggle';

export default function StudentSettings() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    assignment: false,
    quiz: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Edu_layout>
        <div className="min-h-screen bg-[#FDF8F3] dark:bg-[#121212] p-6 md:p-10 transition-colors">
          <h2 className="text-2xl font-bold text-[#292929] dark:text-white mb-8">Settings</h2>

          {/* Profile Info */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row items-start gap-6 mb-8 border border-[#E1D5C9] dark:border-[#333]">
            <div className="flex-1 w-full">
              <div className="mb-4">
                <label className="block text-[#292929] dark:text-white font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:border-[#444] dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#292929] dark:text-white font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:border-[#444] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[#292929] dark:text-white font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:border-[#444] dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col mr-2 ml-6 items-center justify-center w-full lg:w-auto">
              <FaUserCircle className="text-[200px] text-[#A6A6A6]  dark:text-gray-500" />
              <button className="text-sm text-blue-600 dark:text-blue-400 mt-2 hover:underline">Change</button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm p-6 border border-[#E1D5C9] dark:border-[#333]">
              <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', key: 'email' },
                  { label: 'Assignment Reminders', key: 'assignment' },
                  { label: 'Quiz Alerts', key: 'quiz' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between border dark:border-[#444] p-3 rounded-md">
                    <span className="text-[#292929] dark:text-gray-300">{label}</span>
                    <button
                      onClick={() => handleToggle(key)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${notifications[key] ? 'bg-[#F48F0F]' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${notifications[key] ? 'translate-x-6' : ''}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Settings */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm p-6 border border-[#E1D5C9] dark:border-[#333]">
              <h3 className="text-lg font-semibold text-[#292929] dark:text-white mb-4">Other Settings</h3>

              <div className="space-y-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between border dark:border-[#444] p-3 rounded-md">
                  <span className="text-[#292929] dark:text-gray-300">Dark Mode</span>
                  <DarkModeToggle />
                </div>

                {/* Change Password */}
                <div className="flex items-center justify-between border dark:border-[#444] p-3 rounded-md">
                  <span className="text-[#292929] dark:text-gray-300">Change Password</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-1 text-sm rounded-full text-white bg-[#F48F0F] hover:bg-[#d87e0d] transition-all"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Edu_layout>

      {/* Modal */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          console.log("Password Changed:", data);
        }}
      />
    </>
  );
}
