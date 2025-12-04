import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRedirect from './components/AuthRedirect';
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import DepartmentModulesPage from "./pages/DepartmentModulesPage";
import UnenrollModulePage from "./pages/UnenrollModulePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import StudentLayout from "./layouts/StudentLayout";
import LecturerLayout from "./layouts/LecturerLayout";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerModulesPage from "./pages/LecturerModulesPage";
import LecturerCourseDetailPage from "./pages/LecturerCourseDetailPage";
import LecturerStudentsPage from "./pages/LecturerStudentsPage";
import SignupPage from "./pages/SignupPage";
import LecturerProfile from "./pages/LecturerProfile";
import PostAnnouncement from "./pages/PostAnnouncementPage";
import CreateModule from "./pages/CreateModule";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminStudentsPage } from "./pages/AdminStudentsPage";
import { AdminLecturerPage } from "./pages/AdminLecturerPage";
import { AdminDepartmentPage } from "./pages/AdminDepartmentPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import { AdminModulesPage } from "./pages/AdminModulesPage";

export default function App() {
  return (
    <Router>
      <AuthRedirect />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path= "/signup" element={<SignupPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFoundPage />} />

         {/* Student Routes  */}
        <Route path="/dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
        <Route path="/courses" element={<StudentLayout><CoursesPage /></StudentLayout>} />
        <Route path="/profile" element={<StudentLayout><ProfilePage /></StudentLayout>} />
        <Route path="/department-modules" element={<StudentLayout><DepartmentModulesPage /></StudentLayout>} />
        <Route path="/unenroll-module" element={<StudentLayout><UnenrollModulePage /></StudentLayout>} />
        <Route path="/courses/:moduleId" element={<StudentLayout><CourseDetailPage /></StudentLayout>} />

        {/* Lecturer Routes  */}
        <Route path="/lecturer/dashboard" element={<LecturerLayout><LecturerDashboard /></LecturerLayout>} />
        <Route path="/lecturer/modules" element={<LecturerLayout><LecturerModulesPage /></LecturerLayout>} />
        <Route path="/lecturer/modules/:moduleId" element={<LecturerLayout><LecturerCourseDetailPage /></LecturerLayout>} />
        <Route path="/lecturer/students" element={<LecturerLayout><LecturerStudentsPage /></LecturerLayout>} />
        <Route path="/lecturer/profile" element={<LecturerLayout><LecturerProfile /></LecturerLayout>} />
        <Route path="/create-announcement" element={<LecturerLayout><PostAnnouncement/></LecturerLayout>} />
        <Route path='/create-module' element={<LecturerLayout><CreateModule/></LecturerLayout>} />

        {/* Admin Routes  */}
        <Route path= '/admin/dashboard' element={<AdminLayout><AdminDashboard/></AdminLayout>} />
        <Route path='/admin/students' element={<AdminLayout><AdminStudentsPage/></AdminLayout>} />
        <Route path= '/admin/lecturers' element={<AdminLayout> <AdminLecturerPage/></AdminLayout>} /> 
        <Route path= '/admin/departments' element={<AdminLayout><AdminDepartmentPage/></AdminLayout>} /> 
        <Route path= '/admin/profile' element={<AdminLayout><AdminProfilePage/></AdminLayout>} />
        <Route path= '/admin/modules' element={<AdminLayout><AdminModulesPage/></AdminLayout>} />
      </Routes>
    </Router>
  );
}