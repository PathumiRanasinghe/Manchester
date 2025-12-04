import { useEffect, useState } from 'react';
import { getStudentByEmail } from '../services/studentService';
import { getDepartmentById } from '../services/departmentService';
import { Department } from '../types/Department';
import { Student } from '../types/Student';
import { getKeycloak } from '../keycloak';

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setError('Email not found in token');
      setLoading(false);
      return;
    }
    getStudentByEmail(email)
      .then((data: Student) => {
        setStudent(data);
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
  if (!student) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-0 overflow-hidden flex flex-col items-center">
        <div className="w-full flex flex-col items-center pt-8 pb-4">
          <img src="/student.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
          <div className="mt-2 text-xl font-bold text-orange-500">{student.firstName} {student.lastName}</div>
          <div className="text-sm text-gray-500">{student.email}</div>
        </div>
        <div className="w-full px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">First Name</label>
              <div className="text-base text-gray-700 bg-orange-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {student.firstName}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Last Name</label>
              <div className="text-base text-gray-700 bg-orange-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {student.lastName}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
              <div className="text-base text-gray-700 bg-orange-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {student.email}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Department</label>
              <div className="text-base text-gray-700 bg-orange-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {department ? department.departmentName : ''}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}
