import React from "react";
import Spinner from "../components/Spinner";
import { Admin } from "../types/Admin";
import { getAdminByEmail } from "../services/AdminService";
import { getStudentCount } from "../services/studentService";
import { getLecturerCount } from "../services/lecturerService";
import { getModuleCount } from "../services/moduleService";
import { getDepartmentCount } from "../services/departmentService";
import { getKeycloak } from "../keycloak";
import Calendar from "../components/Calendar";
import { toast } from "react-toastify";


export const AdminDashboard = () => {
  const [admin, setAdmin] = React.useState<Admin | null>(null);
  const [studentCount, setStudentCount] = React.useState<number>(0);
  const [lecturerCount, setLecturerCount] = React.useState<number>(0);
  const [moduleCount, setModuleCount] = React.useState<number>(0);
  const [departmentCount, setDepartmentCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      toast.error("Email not found in token");
      setLoading(false);
      return;
    }
    getAdminByEmail(email)
      .then(adminData => {
        setAdmin(adminData);
        return Promise.all([
          getStudentCount(),
          getLecturerCount(),
          getModuleCount(),
          getDepartmentCount()
        ]);
      })
      .then(([students, lecturers, modules, departments]) => {
        setStudentCount(students);
        setLecturerCount(lecturers);
        setModuleCount(modules);
        setDepartmentCount(departments);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner className="p-8" />;
  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2 text-stone-700">Dashboard</h1>
        <div className="mb-6 text-gray-500">
          Welcome back!
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-purple-500">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold text-lg text-purple-600">Students</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{studentCount}</div>
            <div className="flex items-center text-purple-500 text-sm">
              Total Students
            </div>
          </div>
   
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-blue-500">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
              <span className="font-semibold text-lg text-blue-700">Lecturers</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{lecturerCount}</div>
            <div className="flex items-center text-blue-500 text-sm">
              
              Total Lecturers
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-rose-400">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-rose-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
              </svg>
              <span className="font-semibold text-lg text-rose-500">Modules</span>
            </div>
            <div className="text-3xl font-bold text-rose-400 mb-1">{moduleCount}</div>
            <div className="flex items-center text-rose-400 text-sm">
              
              Total Modules
            </div>
          </div>
 
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-green-500">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3v4a1 1 0 001 1h4a1 1 0 001-1v-4h3a1 1 0 001-1V7" />
              </svg>
              <span className="font-semibold text-lg text-green-700">Departments</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{departmentCount}</div>
            <div className="flex items-center text-green-500 text-sm">
              
              Total Departments
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white rounded-xl shadow p-6 ">
              <h2 className="text-lg font-semibold mb-6 text-gray-700">Quick actions</h2>
              <div className="grid grid-cols-1 gap-4">
                  <button
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 shadow border border-gray-100 transition group mb-5"
                    onClick={() => window.location.href = '/admin/create-student'}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-stone-100 text-stone-500 text-xl font-bold">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v6M22 13h-6M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804" />
                        </svg>
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-700 text-base">Add Student</div>
                        <div className="text-xs text-gray-400">Create a new student</div>
                      </div>
                    </div>
                    <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 shadow border border-gray-100 transition group mb-8"
                    onClick={() => window.location.href = '/admin/create-lecturer'}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-stone-100 text-stone-500 text-xl font-bold">
                         <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v6M22 13h-6M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804" />
                        </svg>
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-700 text-base">Add Lecturer</div>
                        <div className="text-xs text-gray-400">Create a new lecturer</div>
                      </div>
                    </div>
                    <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <Calendar />
          </div>
        </div>
       
      </main>
    </div>
  );
};
