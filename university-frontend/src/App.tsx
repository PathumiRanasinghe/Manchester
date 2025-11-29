import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import MainLayout from "./layouts/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import DepartmentModulesPage from "./pages/DepartmentModulesPage";
import UnenrollModulePage from "./pages/UnenrollModulePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import CourseDetailPage from "./pages/CourseDetailPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/dashboard" element={<MainLayout><StudentDashboard /></MainLayout>} />
        <Route path="/courses" element={<MainLayout><CoursesPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/department-modules" element={<MainLayout><DepartmentModulesPage /></MainLayout>} />
        <Route path="/unenroll-module" element={<MainLayout><UnenrollModulePage /></MainLayout>} />
        <Route path="/courses/:moduleId" element={<MainLayout><CourseDetailPage /></MainLayout>} />
      </Routes>
    </Router>
  );
}