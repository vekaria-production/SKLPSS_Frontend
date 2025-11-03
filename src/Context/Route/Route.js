import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "../../Component/Pages/HomePage/HomePage";
import AboutAs from "../../Component/Pages/AboutAs/AboutAs";
import EventsSection from "../../Component/Pages/Event/Event";
import Gallary from "../../Component/Pages/Gallary/Gallary";
import Dashboard from "../../Component/Admin/Dashboard/Dashboard";
import Login from "../../Component/Admin/reusable/Login";
import Edu_management from "../../Component/Admin/Edu_Management/Edu_manage";
import Event from "../../Component/Admin/Event-Management/ManageEvents";
import Managegallery from "../../Component/Admin/Gallery-Management/Managegallery";
import ManageMembers from "../../Component/Admin/Member-Management/ManageMembers";
import GalleryEvent from "../../Component/Pages/Gallary/GalleryEvent";
import Education from "../../Component/Pages/Education/Education";
import MembershipForm from "../../Component/Pages/Membership/MembershipForm";
import EventForm from "../../Component/Admin/Event-Management/Eventform";
import ManagePhotos from "../../Component/Admin/Gallery-Management/ManagePhotos";
import Settings from "../../Component/Admin/Settings/Settings";
import ManageCategories from "../../Component/Admin/Event-Management/ManageCategories";
import StudentDashboard from "../../Component/Pages/Education/Student/Student_Dash";
import Courses from "../../Component/Pages/Education/Student/Courses";
import StudentSettings from "../../Component/Pages/Education/Student/Stu_Settings";
import CourseView from "../../Component/Pages/Education/Student/CourseView";
import AssignmentUpload from "../../Component/Pages/Education/Student/Add_Submission";
import Signup from "../../Component/Pages/Education/SignUp";
import Edu_Login from "../../Component/Pages/Education/Login";
import Teacher_Dash from "../../Component/Pages/Education/Teacher/Teacher_Dash";
import AssignedCourses from "../../Component/Pages/Education/Teacher/Assigned_courses";
import AssignmentForm from "../../Component/Pages/Education/Teacher/AssignmentForm";
import VideoForm from "../../Component/Pages/Education/Teacher/VideoForm";
import Submission from "../../Component/Pages/Education/Teacher/Submission";
import QrScanner from "../../Component/Admin/Event_Registration/Eventregistration";
import PrivateRoute from "./PrivateRoute";
function RouteMmgmt() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutUs" element={<AboutAs />} />
        <Route path="/events" element={<EventsSection />} />
        <Route path="/Gallery" element={<Gallary />} />
        <Route path="/Gallery/:Id/:eventName" element={<GalleryEvent />} />
        <Route path="/Education" element={<Education />} />
        <Route path="/Membership" element={<MembershipForm />} />


        <Route path="/AdminLogin" element={<Login />} />
        <Route path="/Admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/Admin/events" element={<PrivateRoute ><Event /></PrivateRoute>} />
        <Route path="/Admin/events/Manage_Categories" element={<PrivateRoute><ManageCategories /></PrivateRoute>} />
        <Route path="/Admin/Gallery" element={<PrivateRoute><Managegallery /></PrivateRoute>} />
        <Route path="/Admin/Members" element={<PrivateRoute><ManageMembers /></PrivateRoute>} />
        <Route path="/Admin/:Type/:Id" element={<PrivateRoute><EventForm /></PrivateRoute>} />
        <Route path="/Admin/Edit-Gallery/:Id" element={<PrivateRoute><ManagePhotos /></PrivateRoute>} />
        {/* <Route path="/Admin/Education" element={<PrivateRoute><Edu_management /></PrivateRoute>} /> */}
        <Route path="/Admin/Event-Registration" element={<PrivateRoute><QrScanner /></PrivateRoute>} />
        <Route path="/Admin/Settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        
        <Route path="/Education/Student" element={<StudentDashboard />} />
        <Route path="/Education/Student/Courses" element={<Courses />} />
        <Route path="/Education/Student/Settings" element={<StudentSettings />} />
        <Route path="/Education/Student/Course/:id" element={<CourseView />} />
        <Route path="/Education/Student/Course/:courseid/Module/:chapterid/Assignment/:Assignmentid" element={<AssignmentUpload />} />
        <Route path="/Education/SignUp" element={<Signup />} />
        {/* <Route path="/Education/Login" element={<Edu_Login />} /> */}
        {/* <Route path="/Education/Teacher" element={<Teacher_Dash />} /> */}
        <Route path="/Education/Teacher/Courses" element={<AssignedCourses />} />
        <Route path="/Education/Teacher/Course/:id" element={<CourseView />} />
        <Route path="/Education/Teacher/Course/:courseid/Module/:chapterid/Assignment/:Assignmentid" element={<AssignmentForm />} />
        <Route path="/Education/Teacher/Course/:courseid/Module/:chapterid/Video/:Videoid" element={<VideoForm />} />
        <Route path="/Education/Teacher/Course/:courseid/Module/:chapterid/ViewAssignment/:Assignmentid" element={<Submission />} />

      </Routes>
    </BrowserRouter>
  );
}

export default RouteMmgmt;
