import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, BookOpen, Users, Calendar, BarChart3, Link, X } from "lucide-react";

const SubjectManagement = ({ searchTerm }) => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teachers: [],
    coordinator: "",
    category: "Ongoing",
    grade: "",
    duration: "",
    maxStudents: 30
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTeachers = [
      { id: 1, name: "Mr. Sharma", email: "sharma@example.com" },
      { id: 2, name: "Ms. Patel", email: "patel@example.com" },
      { id: 3, name: "Mr. Bhatt", email: "bhatt@example.com" },
      { id: 4, name: "Ms. Desai", email: "desai@example.com" },
      { id: 5, name: "Dr. Kumar", email: "kumar@example.com" },
      { id: 6, name: "Prof. Singh", email: "singh@example.com" }
    ];

    const mockSubjects = [
      {
        id: 1,
        name: "Math Basics",
        description: "Learn fundamental math concepts including numbers, arithmetic, and algebra.",
        teachers: ["Mr. Sharma", "Dr. Kumar"],
        coordinator: "Mr. Sharma",
        category: "Ongoing",
        grade: "Grade 6-8",
        duration: "12 weeks",
        maxStudents: 30,
        enrolledStudents: 28,
        assignments: 6,
        modules: 4,
        completionRate: 85
      },
      {
        id: 2,
        name: "Physics Fundamentals",
        description: "Understand the laws of nature with a focus on motion, energy, and force.",
        teachers: ["Ms. Patel"],
        coordinator: "Ms. Patel",
        category: "Completed",
        grade: "Grade 9-10",
        duration: "16 weeks",
        maxStudents: 25,
        enrolledStudents: 25,
        assignments: 8,
        modules: 6,
        completionRate: 92
      },
      {
        id: 3,
        name: "Gujarati Grammar",
        description: "Dive into the structure of Gujarati language and strengthen your grammar.",
        teachers: ["Mr. Bhatt", "Prof. Singh"],
        coordinator: "Mr. Bhatt",
        category: "Ongoing",
        grade: "All Grades",
        duration: "10 weeks",
        maxStudents: 20,
        enrolledStudents: 18,
        assignments: 4,
        modules: 3,
        completionRate: 78
      },
      {
        id: 4,
        name: "Computer Science",
        description: "Basics of computer operations, programming, and digital logic.",
        teachers: ["Ms. Desai"],
        coordinator: "Ms. Desai",
        category: "Upcoming",
        grade: "Grade 7-9",
        duration: "14 weeks",
        maxStudents: 25,
        enrolledStudents: 0,
        assignments: 0,
        modules: 0,
        completionRate: 0
      }
    ];
    setTeachers(mockTeachers);
    setSubjects(mockSubjects);
  }, []);

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teachers.some(teacher => teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
    subject.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      description: "",
      teachers: [],
      coordinator: "",
      category: "Ongoing",
      grade: "",
      duration: "",
      maxStudents: 30
    });
    setShowModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData(subject);
    setShowModal(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...formData, id: editingSubject.id } : s));
    } else {
      const newSubject = { 
        ...formData, 
        id: Date.now(), 
        enrolledStudents: 0, 
        assignments: 0, 
        modules: 0, 
        completionRate: 0 
      };
      setSubjects(prev => [...prev, newSubject]);
    }
    setShowModal(false);
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddTeacher = () => {
    const newTeacher = "";
    setFormData(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher]
    }));
  };

  const handleRemoveTeacher = (index) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.filter((_, i) => i !== index)
    }));
  };

  const handleTeacherChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.map((teacher, i) => i === index ? value : teacher)
    }));
  };

  const getCategoryBadge = (category) => {
    const categoryClasses = {
      "Ongoing": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Completed": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Upcoming": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryClasses[category]}`}>
        {category}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#292929] dark:text-white">
          Subject Management
        </h2>
        <button
          onClick={handleAddSubject}
          className="flex items-center gap-2 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
        >
          <Plus size={16} />
          Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F48F0F] rounded-full flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#292929] dark:text-white">{subject.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {subject.id}</p>
                </div>
              </div>
              {getCategoryBadge(subject.category)}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {subject.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Teachers: {subject.teachers.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Coordinator: {subject.coordinator}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Grade: {subject.grade}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 size={16} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Duration: {subject.duration}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Enrollment</span>
                <span className="text-gray-600 dark:text-gray-300">{subject.enrolledStudents}/{subject.maxStudents}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#F48F0F] h-2 rounded-full" 
                  style={{ width: `${(subject.enrolledStudents / subject.maxStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#F48F0F]">{subject.assignments}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assignments</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#F48F0F]">{subject.modules}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#F48F0F]">{subject.completionRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditSubject(subject)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#292929] dark:text-white">
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="Enter subject name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="Enter subject description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teachers
                </label>
                <div className="space-y-2">
                  {formData.teachers.map((teacher, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={teacher}
                        onChange={(e) => handleTeacherChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                      >
                        <option value="">Select a teacher</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.name}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddTeacher}
                    className="flex items-center gap-2 px-3 py-2 text-[#F48F0F] hover:bg-[#F48F0F]/10 rounded-lg transition border border-[#F48F0F] border-dashed"
                  >
                    <Plus size={16} />
                    Add Teacher
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Coordinator
                </label>
                <select
                  value={formData.coordinator}
                  onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="">Select a coordinator</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.name}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Only the coordinator can add/edit assignments and videos for this course
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade Level
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="e.g., Grade 6-8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  placeholder="e.g., 12 weeks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveSubject}
                className="flex-1 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
              >
                {editingSubject ? "Update" : "Add"} Subject
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

export default SubjectManagement;
