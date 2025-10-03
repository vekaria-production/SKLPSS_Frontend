import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, GraduationCap } from "lucide-react";

const StudentManagement = ({ searchTerm, filterRole }) => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    subjects: [],
    enrollmentDate: "",
    status: "active"
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: "Yagnik Patel",
        email: "yagnik@example.com",
        phone: "+248-123-4567",
        grade: "Grade 10",
        subjects: ["Math", "Physics", "Gujarati"],
        enrollmentDate: "2024-01-15",
        status: "active",
        assignmentsCompleted: 15,
        assignmentsPending: 3
      },
      {
        id: 2,
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+248-234-5678",
        grade: "Grade 9",
        subjects: ["Math", "Chemistry", "Computer Science"],
        enrollmentDate: "2024-02-01",
        status: "active",
        assignmentsCompleted: 12,
        assignmentsPending: 5
      },
      {
        id: 3,
        name: "Arjun Mehta",
        email: "arjun@example.com",
        phone: "+248-345-6789",
        grade: "Grade 11",
        subjects: ["Physics", "Biology", "Geography"],
        enrollmentDate: "2024-01-20",
        status: "inactive",
        assignmentsCompleted: 8,
        assignmentsPending: 7
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || filterRole === "student";
    return matchesSearch && matchesRole;
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      grade: "",
      subjects: [],
      enrollmentDate: "",
      status: "active"
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...formData, id: editingStudent.id } : s));
    } else {
      const newStudent = { ...formData, id: Date.now() };
      setStudents(prev => [...prev, newStudent]);
    }
    setShowModal(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
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
          Student Management
        </h2>
        <button
          onClick={handleAddStudent}
          className="flex items-center gap-2 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
        >
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Grade</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Subjects</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Progress</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F48F0F] rounded-full flex items-center justify-center">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929] dark:text-white">{student.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{student.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600 dark:text-gray-300">{student.grade}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.slice(0, 2).map((subject, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                        {subject}
                      </span>
                    ))}
                    {student.subjects.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{student.subjects.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Completed: {student.assignmentsCompleted}</span>
                      <span className="text-gray-600 dark:text-gray-300">Pending: {student.assignmentsPending}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#F48F0F] h-2 rounded-full" 
                        style={{ width: `${(student.assignmentsCompleted / (student.assignmentsCompleted + student.assignmentsPending)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(student.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
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

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-bold text-[#292929] dark:text-white">
              {editingStudent ? "Edit Student" : "Add New Student"}
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
                  Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
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
                onClick={handleSaveStudent}
                className="flex-1 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
              >
                {editingStudent ? "Update" : "Add"} Student
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

export default StudentManagement;
