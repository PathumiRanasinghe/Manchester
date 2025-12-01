import { useEffect, useState } from 'react';
import { getDepartmentById } from '../services/departmentService';
import { Department } from '../types/Department';
import { Lecturer } from '../types/Lecturer';
import { getLecturerById } from '../services/lecturerService';

export default function LecturerProfile() {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLecturerById(2)
      .then((data: Lecturer) => {
        setLecturer(data);
        if (data.department.departmentId) {
          getDepartmentById(data.department.departmentId)
            .then((dept: Department) => {
              setDepartment(dept);
              setLoading(false);
            })
            .catch(() => {
              setError('Failed to fetch department details');
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to fetch student details');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!lecturer) return null;

  return (
    <div className="min-h-screen  p-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 flex flex-col items-center gap-6">
       <h1 className="text-3xl font-bold  mb-6">My Profile</h1>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center w-full">
          <img src="/lecturer.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-2" />
          <div className="text-lg font-bold text-sky-500">{lecturer.firstName} {lecturer.lastName}</div>
          <div className="text-sm text-gray-500 mb-2">Lecturer</div>
        </div>
          <section className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold text-sky-500 mb-4">Change Password</h2>
          <div className="flex flex-col gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" className="w-full border rounded px-3 py-2" placeholder="Enter new password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Re-type New Password</label>
              <input type="password" className="w-full border rounded px-3 py-2" placeholder="Enter new password again" />
            </div>
          </div>
          <button className="bg-sky-400 text-white px-6 py-2 rounded font-semibold hover:bg-sky-500">SAVE CHANGES</button>
        </section>
      </aside>
      
      <main className="flex-1">
       
        <form className="mt-20 bg-white rounded-xl shadow p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" value={lecturer.firstName} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" value={lecturer.lastName} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={lecturer.email} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" value={department ? department.departmentName : lecturer.department.departmentId} className="w-full border rounded px-3 py-2" readOnly />
            </div>
          </div>

        </form>
      
      </main>
    </div>
  );
}
