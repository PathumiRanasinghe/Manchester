import React, { useEffect, useState } from 'react';
import { Module } from '../types/Module';
import { useParams } from 'react-router-dom';
import { getModuleById } from '../services/moduleService';
import { Lecturer } from '../types/Lecturer';
import { Department } from '../types/Department';
import { getLecturerById } from '../services/lecturerService';
import { getDepartmentById} from '../services/departmentService';

const CourseDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      getModuleById(Number(moduleId))
        .then(found => {
          setModule(found || null);
          if (found) {
            Promise.all([
              getLecturerById(found.lecturer.lecturerId),
              getDepartmentById(found.department.departmentId)
            ]).then(([lecturerData, departmentData]) => {
              setLecturer(lecturerData);
              setDepartment(departmentData);
              setLoading(false);
            }).catch(() => {
              setError('Failed to fetch lecturer or department');
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setError('Failed to fetch module');
          setLoading(false);
        });
    }, [moduleId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !module) return <div className="p-8 text-red-500">{error || 'Module not found'}</div>;

  return (
      <div className="min-h-screen  flex flex-col items-center py-10">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 w-full h-70 md:h-auto relative m-8">
              <img src="/module.png" alt="Course" className="object-cover w-full h-full rounded-2xl" />
              
            </div>
            <div className="md:w-3/5 w-full p-8 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{module.moduleName}</h1>
           
              <ul className="text-s text-gray-500 mb-2 list-disc pl-5">
                <li>Lecturer: {lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : module.lecturer.lecturerId}</li>
                <li>Department: {department ? department.departmentName : module.department.departmentId}</li>
                <li>Module ID: {module.moduleId}</li>
              </ul>
              <div className="flex gap-4 mt-4 text-s">
                <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-semibold">Credits: {module.credits}</span>
                </div>
            </div>
          </div>
          <div className="border-b mt-3 px-8 flex gap-6 text-gray-500 text-sm font-semibold">
            <button className="text-orange-500 border-b-2 border-orange-400 pb-2">Overview</button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 px-8 py-8">
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold mb-2 text-gray-700">Course Details</h2>
               <p className="text-gray-600 mb-4">{module.description}</p>
            </div>
           
          </div>
        </div>
      </div>
  );
};

export default CourseDetailPage;
