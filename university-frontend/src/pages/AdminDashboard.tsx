import React from "react";
import Spinner from "../components/Spinner";
import { Admin } from "../types/Admin";
import { getAdminByEmail } from "../services/AdminService";
import { getStudents } from "../services/studentService";
import { getLecturers } from "../services/lecturerService";
import api from "../services/api";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getKeycloak } from "../keycloak";
import Calendar from "../components/Calendar";

export const AdminDashboard = () => {
    const [enrollmentsPerDay, setEnrollmentsPerDay] = useState<{ date: string, count: number }[]>([]);
  const [admin, setAdmin] = React.useState<Admin | null>(null);
  const [studentCount, setStudentCount] = React.useState<number>(0);
  const [lecturerCount, setLecturerCount] = React.useState<number>(0);
  const [moduleCount, setModuleCount] = React.useState<number>(0);
  const [departmentCount, setDepartmentCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      api.get("/enrollments").then(res => {
          const enrollments = res.data;
          const dayCounts: { [date: string]: number } = {};
          enrollments.forEach((e: any) => {
            const date = new Date(e.enrollmentDate).toISOString().slice(0, 10);
            dayCounts[date] = (dayCounts[date] || 0) + 1;
          });
          const sorted = Object.entries(dayCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count }));
          setEnrollmentsPerDay(sorted);
        });
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setError("Email not found in token");
      setLoading(false);
      return;
    }
    getAdminByEmail(email)
      .then(adminData => {
        setAdmin(adminData);
        return Promise.all([
          getStudents(),
          getLecturers(),
          api.get("/modules").then(res => res.data),
          api.get("/departments").then(res => res.data)
        ]);
      })
      .then(([students, lecturers, modules, departments]) => {
        setStudentCount(students.length);
        setLecturerCount(lecturers.length);
        setModuleCount(modules.length);
        setDepartmentCount(departments.length);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner className="p-8" />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  
          <div className="bg-white rounded-xl shadow p-6">
           <Calendar />
          </div>
       
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="font-semibold text-lg text-stone-700  mt-5 mb-12">Enrollments Per Day</div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={enrollmentsPerDay} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" interval={0} height={50} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#68646eff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-5 text-stone-500 text-sm">Last {enrollmentsPerDay.length} days</div>
          </div>
        </div>
       
      </main>
    </div>
  );
};
