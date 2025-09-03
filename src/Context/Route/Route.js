import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "../../Component/Pages/HomePage/HomePage";
import AboutAs from "../../Component/Pages/AboutAs/AboutAs";
import EventsSection from "../../Component/Pages/Event/Event";
import Gallary from "../../Component/Pages/Gallary/Gallary";
import Dashboard from "../../Component/Admin/Dashboard/Dashboard";
import LoginForm from "../../Component/Admin/reusable/Login";
import Event from "../../Component/Admin/Event-Management/ManageEvents";
import Managegallery from "../../Component/Admin/Gallery-Management/Managegallery";
import ManageMembers from "../../Component/Admin/Member-Management/ManageMembers";
import GalleryEvent from "../../Component/Pages/Gallary/GalleryEvent";
import Education from "../../Component/Pages/Education/Education";
import MembershipForm from "../../Component/Pages/Membership/MembershipForm";
import EventForm from "../../Component/Admin/Event-Management/Eventform";
import ManagePhotos from "../../Component/Admin/Gallery-Management/ManagePhotos";
import ManageCategories from "../../Component/Admin/Event-Management/ManageCategories";

import Settings from "../../Component/Admin/Settings/Settings";

import { AuthProvider } from "../Auth/AuthContext";
import PrivateRoute from "./PrivateRoute";


function RouteMmgmt() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aboutUs" element={<AboutAs />} />
          <Route path="/events" element={<EventsSection />} />
          <Route path="/Gallery" element={<Gallary />} />
          <Route path="/Gallery/:Id/:eventName" element={<GalleryEvent />} />
          <Route path="/Education" element={<Education />} />
          <Route path="/Membership" element={<MembershipForm />} />

          
          <Route path="/AdminLogin" element={<LoginForm />} />
          <Route path="/Admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/Admin/events" element={<PrivateRoute><Event /></PrivateRoute>} />
          <Route path="/Admin/events/Manage_Categories" element={<PrivateRoute><ManageCategories /></PrivateRoute>} />
          <Route path="/Admin/Gallery" element={<PrivateRoute><Managegallery /></PrivateRoute>} />
          <Route path="/Admin/Members" element={<PrivateRoute><ManageMembers /></PrivateRoute>} />
          <Route path="Admin/:Type/:Id" element={<PrivateRoute><EventForm /></PrivateRoute>} />
          <Route path="/Admin/Edit-Gallery/:Id" element={<PrivateRoute><ManagePhotos /></PrivateRoute>} />
          <Route path="/Admin/Settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default RouteMmgmt;
