import { useEffect, useState } from 'react';
import { getDepartmentById } from '../services/departmentService';
import { Department } from '../types/Department';
import { Lecturer } from '../types/Lecturer';
import { getLecturerByEmail } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';

export default function LecturerProfile() {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
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
    getLecturerByEmail(email)
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
        setError('Failed to fetch lecturer details');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!lecturer) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-sky-100 to-white">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-0 overflow-hidden flex flex-col items-center">
        <div className="w-full flex flex-col items-center pt-8 pb-4">
          <img src="/lecturer.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
          <div className="mt-2 text-xl font-bold text-sky-500">{lecturer.firstName} {lecturer.lastName}</div>
          <div className="text-sm text-gray-500">Lecturer</div>
        </div>
        <div className="w-full px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">First Name</label>
              <div className="text-base text-gray-700 bg-sky-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                {lecturer.firstName}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Last Name</label>
              <div className="text-base text-gray-700 bg-sky-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                {lecturer.lastName}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
              <div className="text-base text-gray-700 bg-sky-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                {lecturer.email}
              </div>
            </div>
            <div className="md:col-span-2 mb-10">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Department</label>
              <div className="text-base text-gray-700 bg-sky-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                {department ? department.departmentName : ''}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}
