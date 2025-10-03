import React, { useState } from 'react';
import Edu_layout from '../reusable/Edu_layout';
import { coursesData, recommendedCourses } from '../../../../assets/CoursesData';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Completed', 'Ongoing', 'Starred'];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState(coursesData);
  const navigate = useNavigate();
  const handleToggleStar = async (courseId) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, starred: !course.starred } : course
    );
    setCourses(updatedCourses);

    try {
      await fakeApiUpdateStar(courseId);
      console.log('Star status updated on server');
    } catch (error) {
      console.error('Failed to update star:', error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Starred' && course.starred) ||
      course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Edu_layout>
      <div className="bg-[#FDF8F3] dark:bg-[#121212] min-h-screen p-6 transition-colors duration-300">
        <div className="flex gap-3 mb-6">
          <select
            className="border dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white rounded-md px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Courses"
            className="border dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white rounded-md px-4 py-2 w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="relative bg-white dark:bg-[#1a1a1a] border border-[#E1D5C9] dark:border-[#333] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-sm duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_10px_rgba(244,143,15,0.4)]"
            >
              <button
                className="absolute top-4 right-4 text-xl text-yellow-400"
                onClick={() => handleToggleStar(course.id)}
                title={course.starred ? 'Unstar' : 'Star'}
              >
                <FaStar className={course.starred ? 'fill-current' : 'text-gray-300'} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-[#292929] dark:text-white">{course.name}</h3>
                <p className="text-sm text-[#292929] dark:text-gray-300">{course.teacher}</p>
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => navigate(`/Education/Student/Course/${course.id}`)}
                  className="bg-[#F48F0F] text-[#292929] text-sm px-4 py-2 rounded-md hover:bg-white hover:text-[#F48F0F] dark:hover:bg-[#333] dark:hover:text-white border border-transparent transition-all duration-300 ease-in-out"
                >
                  Start Learning
                </button>
                <button onClick={() => alert("Under development")} className="bg-[#F48F0F] text-[#292929] text-sm px-4 py-2 rounded-md hover:bg-white hover:text-[#F48F0F] dark:hover:bg-[#333] dark:hover:text-white border border-transparent transition-all duration-300 ease-in-out">
                  Take a Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Edu_layout>
  );
}

// Mock API
const fakeApiUpdateStar = (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updated star for course ID ${courseId}`);
      resolve();
    }, 500);
  });
};
