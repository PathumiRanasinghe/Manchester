import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRedirect from './components/AuthRedirect';
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import DepartmentModulesPage from "./pages/DepartmentModulesPage";
import UnenrollModulePage from "./pages/UnenrollModulePage";
import LogoutPage from "./pages/LogoutPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import StudentLayout from "./layouts/StudentLayout";
import LecturerLayout from "./layouts/LecturerLayout";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerModulesPage from "./pages/LecturerModulesPage";
import LecturerCourseDetailPage from "./pages/LecturerCourseDetailPage";
import LecturerStudentsPage from "./pages/LecturerStudentsPage";
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
import AdminEnrollmentPage from "./pages/AdminEnrollmentPage";
import AdminCreateStudentPage from './pages/AdminCreateStudentPage';
import AdminCreateLecturerPage from "./pages/AdminCreateLecturerPage";
import ProtectedRoute from './ProtectedRoute';
import ForbiddenPage from "./pages/ForbiddenPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
      <AuthRedirect />
      <ToastContainer />
      <Routes>
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />

        {/* Student Routes  */}
        <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentLayout><StudentDashboard /></StudentLayout></ProtectedRoute>} />
        <Route path="/modules" element={<ProtectedRoute role="student"><StudentLayout><CoursesPage /></StudentLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="student"><StudentLayout><ProfilePage /></StudentLayout></ProtectedRoute>} />
        <Route path="/department-modules" element={<ProtectedRoute role="student"><StudentLayout><DepartmentModulesPage /></StudentLayout></ProtectedRoute>} />
        <Route path="/unenroll-module" element={<ProtectedRoute role="student"><StudentLayout><UnenrollModulePage /></StudentLayout></ProtectedRoute>} />
        <Route path="/courses/:moduleId" element={<ProtectedRoute role="student"><StudentLayout><CourseDetailPage /></StudentLayout></ProtectedRoute>} />

        {/* Lecturer Routes  */}
        <Route path="/lecturer/dashboard" element={<ProtectedRoute role="lecturer"><LecturerLayout><LecturerDashboard /></LecturerLayout></ProtectedRoute>} />
        <Route path="/lecturer/modules" element={<ProtectedRoute role="lecturer"><LecturerLayout><LecturerModulesPage /></LecturerLayout></ProtectedRoute>} />
        <Route path="/lecturer/modules/:moduleId" element={<ProtectedRoute role="lecturer"><LecturerLayout><LecturerCourseDetailPage /></LecturerLayout></ProtectedRoute>} />
        <Route path="/lecturer/students" element={<ProtectedRoute role="lecturer"><LecturerLayout><LecturerStudentsPage /></LecturerLayout></ProtectedRoute>} />
        <Route path="/lecturer/profile" element={<ProtectedRoute role="lecturer"><LecturerLayout><LecturerProfile /></LecturerLayout></ProtectedRoute>} />
        <Route path="/create-announcement" element={<ProtectedRoute role="lecturer"><LecturerLayout><PostAnnouncement/></LecturerLayout></ProtectedRoute>} />
        <Route path='/create-module' element={<ProtectedRoute role="lecturer"><LecturerLayout><CreateModule/></LecturerLayout></ProtectedRoute>} />

        {/* Admin Routes  */}
        <Route path= '/admin/dashboard' element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard/></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/students' element={<ProtectedRoute role="admin"><AdminLayout><AdminStudentsPage/></AdminLayout></ProtectedRoute>} />
        <Route path= '/admin/lecturers' element={<ProtectedRoute role="admin"><AdminLayout> <AdminLecturerPage/></AdminLayout></ProtectedRoute>} /> 
        <Route path= '/admin/departments' element={<ProtectedRoute role="admin"><AdminLayout><AdminDepartmentPage/></AdminLayout></ProtectedRoute>} /> 
        <Route path= '/admin/profile' element={<ProtectedRoute role="admin"><AdminLayout><AdminProfilePage/></AdminLayout></ProtectedRoute>} />
        <Route path= '/admin/modules' element={<ProtectedRoute role="admin"><AdminLayout><AdminModulesPage/></AdminLayout></ProtectedRoute>} />
        <Route path= '/admin/enrollments' element={<ProtectedRoute role="admin"><AdminLayout><AdminEnrollmentPage/></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/create-student" element={<ProtectedRoute role="admin"><AdminLayout><AdminCreateStudentPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/create-lecturer" element={<ProtectedRoute role="admin"><AdminLayout><AdminCreateLecturerPage /></AdminLayout></ProtectedRoute>} />
       </Routes>
    </Router>
  );
}