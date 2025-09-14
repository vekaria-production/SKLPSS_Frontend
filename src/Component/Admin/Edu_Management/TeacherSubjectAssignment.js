import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react";

const TeacherSubjectAssignment = ({ searchTerm }) => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: "",
    subjectId: "",
    startDate: "",
    endDate: "",
    status: "active",
    maxStudents: 30
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTeachers = [
      { id: 1, name: "Mr. Sharma", email: "sharma@example.com", subjects: ["Math Basics", "Calculus"] },
      { id: 2, name: "Ms. Patel", email: "patel@example.com", subjects: ["Physics Fundamentals"] },
      { id: 3, name: "Mr. Bhatt", email: "bhatt@example.com", subjects: ["Gujarati Grammar"] },
      { id: 4, name: "Ms. Desai", email: "desai@example.com", subjects: [] }
    ];

    const mockSubjects = [
      { id: 1, name: "Math Basics", description: "Learn fundamental math concepts", grade: "Grade 6-8" },
      { id: 2, name: "Physics Fundamentals", description: "Understand the laws of nature", grade: "Grade 9-10" },
      { id: 3, name: "Gujarati Grammar", description: "Dive into Gujarati language structure", grade: "All Grades" },
      { id: 4, name: "Computer Science", description: "Basics of computer operations", grade: "Grade 7-9" },
      { id: 5, name: "Chemistry", description: "Explore chemical reactions", grade: "Grade 8-10" }
    ];

    const mockAssignments = [
      {
        id: 1,
        teacherId: 1,
        subjectId: 1,
        teacherName: "Mr. Sharma",
        subjectName: "Math Basics",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        status: "active",
        maxStudents: 30,
        enrolledStudents: 28,
        completionRate: 85
      },
      {
        id: 2,
        teacherId: 2,
        subjectId: 2,
        teacherName: "Ms. Patel",
        subjectName: "Physics Fundamentals",
        startDate: "2024-02-01",
        endDate: "2024-05-01",
        status: "active",
        maxStudents: 25,
        enrolledStudents: 25,
        completionRate: 92
      },
      {
        id: 3,
        teacherId: 3,
        subjectId: 3,
        teacherName: "Mr. Bhatt",
        subjectName: "Gujarati Grammar",
        startDate: "2024-01-20",
        endDate: "2024-03-20",
        status: "completed",
        maxStudents: 20,
        enrolledStudents: 18,
        completionRate: 100
      }
    ];

    setTeachers(mockTeachers);
    setSubjects(mockSubjects);
    setAssignments(mockAssignments);
  }, []);

  const filteredAssignments = assignments.filter(assignment => 
    assignment.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setFormData({
      teacherId: "",
      subjectId: "",
      startDate: "",
      endDate: "",
      status: "active",
      maxStudents: 30
    });
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setFormData(assignment);
    setShowModal(true);
  };

  const handleSaveAssignment = () => {
    const selectedTeacher = teachers.find(t => t.id === parseInt(formData.teacherId));
    const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));

    if (editingAssignment) {
      setAssignments(prev => prev.map(a => 
        a.id === editingAssignment.id 
          ? { 
              ...formData, 
              id: editingAssignment.id,
              teacherName: selectedTeacher?.name || "",
              subjectName: selectedSubject?.name || ""
            } 
          : a
      ));
    } else {
      const newAssignment = { 
        ...formData, 
        id: Date.now(),
        teacherName: selectedTeacher?.name || "",
        subjectName: selectedSubject?.name || "",
        enrolledStudents: 0,
        completionRate: 0
      };
      setAssignments(prev => [...prev, newAssignment]);
    }
    setShowModal(false);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getAvailableSubjects = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return subjects;
    
    const assignedSubjectIds = assignments
      .filter(a => a.teacherId === teacherId && a.status === "active")
      .map(a => a.subjectId);
    
    return subjects.filter(s => !assignedSubjectIds.includes(s.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#292929] dark:text-white">
          Teacher-Subject Assignments
        </h2>
        <button
          onClick={handleAddAssignment}
          className="flex items-center gap-2 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
        >
          <Plus size={16} />
          Assign Subject
        </button>
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Teacher</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Subject</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Duration</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Enrollment</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F48F0F] rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929] dark:text-white">{assignment.teacherName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {assignment.teacherId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929] dark:text-white">{assignment.subjectName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {assignment.subjectId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {new Date(assignment.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      to {new Date(assignment.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {assignment.enrolledStudents}/{assignment.maxStudents}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {assignment.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#F48F0F] h-2 rounded-full" 
                        style={{ width: `${assignment.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(assignment.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
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

      {/* Add/Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-bold text-[#292929] dark:text-white">
              {editingAssignment ? "Edit Assignment" : "Assign Subject to Teacher"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Teacher
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="">Choose a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Subject
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                >
                  <option value="">Choose a subject</option>
                  {getAvailableSubjects(parseInt(formData.teacherId)).map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.grade})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F48F0F]"
                  />
                </div>
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
                  <option value="completed">Completed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveAssignment}
                className="flex-1 px-4 py-2 bg-[#F48F0F] text-white rounded-lg hover:bg-[#e1810c] transition"
              >
                {editingAssignment ? "Update" : "Assign"} Subject
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

export default TeacherSubjectAssignment;
