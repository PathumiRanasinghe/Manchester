
import { useEffect, useState } from 'react';
import { getDepartmentById } from '../services/departmentService';
import { Department } from '../types/Department';
import { Lecturer } from '../types/Lecturer';
import { getLecturerByEmail } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';
import { EnvelopeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

export default function LecturerProfile() {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      toast.error('Email not found in token');
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
              toast.error('Failed to fetch department details');
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error('Failed to fetch lecturer details');
        setLoading(false);
      });
  }, []);


  if (loading) return <Spinner className="p-8" />;
  if (!lecturer) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden flex flex-col items-center">
  
        <div className="w-full flex flex-col items-center pt-10 pb-4 ">
          <img src="/lecturer.png" alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
          <div className="mt-3 text-2xl font-bold text-blue-500">{lecturer.firstName} {lecturer.lastName}</div>
          <div className="text-sm text-blue-400">{lecturer.email}</div>
        </div>

        <div className="w-full px-10 pb-10 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">First Name</label>
              <div className="text-base text-gray-700 bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {lecturer.firstName}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Last Name</label>
              <div className="text-base text-gray-700 bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {lecturer.lastName}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
              <div className="text-base text-gray-700 bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-blue-400 mr-2" />
                {lecturer.email}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Department</label>
              <div className="text-base text-gray-700 bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5 text-blue-400 mr-2" />
                {department ? department.departmentName : ''}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
