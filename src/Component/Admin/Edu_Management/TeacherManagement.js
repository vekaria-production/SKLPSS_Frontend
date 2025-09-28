import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Mail, Phone, Calendar, Users, BookOpen, Award } from "lucide-react";

const TeacherManagement = ({ searchTerm, filterRole }) => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    qualifications: "",
    experience: "",
    joinDate: "",
    status: "active"
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTeachers = [
      {
        id: 1,
        name: "Mr. Sharma",
        email: "sharma@example.com",
        phone: "+248-111-2222",
        subjects: ["Math Basics", "Calculus"],
        qualifications: "M.Sc Mathematics",
        experience: "5 years",
        joinDate: "2023-01-15",
        status: "active",
        studentsCount: 32,
        coursesCount: 2
      },
      {
        id: 2,
        name: "Ms. Patel",
        email: "patel@example.com",
        phone: "+248-222-3333",
        subjects: ["Physics Fundamentals"],
        qualifications: "M.Sc Physics",
        experience: "3 years",
        joinDate: "2023-03-01",
        status: "active",
        studentsCount: 28,
        coursesCount: 1
      },
      {
        id: 3,
        name: "Mr. Bhatt",
        email: "bhatt@example.com",
        phone: "+248-333-4444",
        subjects: ["Gujarati Grammar"],
        qualifications: "M.A Gujarati Literature",
        experience: "7 years",
        joinDate: "2022-08-15",
        status: "active",
        studentsCount: 25,
        coursesCount: 1
      }
    ];
    setTeachers(mockTeachers);
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || filterRole === "teacher";
    return matchesSearch && matchesRole;
  });

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subjects: [],
      qualifications: "",
      experience: "",
      joinDate: "",
      status: "active"
    });
    setShowModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setShowModal(true);
  };

  const handleSaveTeacher = () => {
    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...formData, id: editingTeacher.id } : t));
    } else {
      const newTeacher = { ...formData, id: Date.now(), studentsCount: 0, coursesCount: 0 };
      setTeachers(prev => [...prev, newTeacher]);
    }
    setShowModal(false);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#292929] dark:text-white">
          Teacher Management
        </h2>
        <button
          onClick={handleAddTeacher}
          className="flex items-center gap-2 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>

      {/* Teachers Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Qualifications</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Subjects</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Performance</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F48F0F] rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929] dark:text-white">{teacher.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {teacher.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{teacher.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Award size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{teacher.qualifications}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">Exp: {teacher.experience}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.slice(0, 2).map((subject, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                        {subject}
                      </span>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{teacher.subjects.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Students: {teacher.studentsCount}</span>
                      <span className="text-gray-600 dark:text-gray-300">Courses: {teacher.coursesCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#F48F0F] h-2 rounded-full" 
                        style={{ width: `${Math.min((teacher.studentsCount / 30) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(teacher.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#292929] dark:text-white">
              {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Qualifications
                </label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="e.g., M.Sc Mathematics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="e.g., 5 years"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveTeacher}
                className="flex-1 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
              >
                {editingTeacher ? "Update" : "Add"} Teacher
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
