import React, { useEffect, useState } from 'react';
import { getStudentById } from '../services/studentService';
import { getDepartmentById, Department } from '../services/departmentService';

interface Student {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
}

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentById(1)
      .then((data: Student) => {
        setStudent(data);
        if (data.departmentId) {
          getDepartmentById(data.departmentId)
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
  if (!student) return null;

  return (
    <div className="min-h-screen  p-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 flex flex-col items-center gap-6">
       <h1 className="text-3xl font-bold  mb-6">My Profile</h1>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center w-full">
          <img src="/student.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-2" />
          <div className="text-lg font-bold text-orange-500">{student.firstName} {student.lastName}</div>
          <div className="text-sm text-gray-500 mb-2">Student</div>
        </div>
          <section className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Change Password</h2>
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
          <button className="bg-orange-400 text-white px-6 py-2 rounded font-semibold hover:bg-orange-500">SAVE CHANGES</button>
        </section>
      </aside>
      
      <main className="flex-1">
       
        <form className="mt-20 bg-white rounded-xl shadow p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" value={student.firstName} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" value={student.lastName} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={student.email} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={student.phoneNumber} className="w-full border rounded px-3 py-2" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" value={department ? department.departmentName : student.departmentId} className="w-full border rounded px-3 py-2" readOnly />
            </div>
          </div>

        </form>
      
      </main>
    </div>
  );
}
