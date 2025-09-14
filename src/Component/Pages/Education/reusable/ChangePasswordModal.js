import React, { useState } from "react";

export default function ChangePasswordModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    onSave?.(formData);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl w-full max-w-md p-6 border border-[#E1D5C9] dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#292929] dark:text-white">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#292929] dark:text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm text-[#292929] dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm text-[#292929] dark:text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]"
              placeholder="Confirm new password"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-[#292929] dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#F48F0F] text-white hover:bg-[#d87e0d] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
