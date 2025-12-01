import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path= "/signup" element={<SignupPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
        <Route path="/courses" element={<StudentLayout><CoursesPage /></StudentLayout>} />
        <Route path="/profile" element={<StudentLayout><ProfilePage /></StudentLayout>} />
        <Route path="/department-modules" element={<StudentLayout><DepartmentModulesPage /></StudentLayout>} />
        <Route path="/unenroll-module" element={<StudentLayout><UnenrollModulePage /></StudentLayout>} />
        <Route path="/courses/:moduleId" element={<StudentLayout><CourseDetailPage /></StudentLayout>} />
        <Route path="/lecturer/dashboard" element={<LecturerLayout><LecturerDashboard /></LecturerLayout>} />
        <Route path="/lecturer/modules" element={<LecturerLayout><LecturerModulesPage /></LecturerLayout>} />
        <Route path="/lecturer/modules/:moduleId" element={<LecturerLayout><LecturerCourseDetailPage /></LecturerLayout>} />
        <Route path="/lecturer/students" element={<LecturerLayout><LecturerStudentsPage /></LecturerLayout>} />
        <Route path="/lecturer/profile" element={<LecturerLayout><LecturerProfile /></LecturerLayout>} />
      </Routes>
    </Router>
  );
}