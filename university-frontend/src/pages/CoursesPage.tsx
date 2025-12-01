import React, { useEffect, useState } from 'react';
import { getModulesByStudentId } from '../services/moduleService';
import { useNavigate } from 'react-router-dom';
import { Module } from '../types/Module';

const studentId = 1;

const CoursesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getModulesByStudentId(studentId)
      .then((data: Module[]) => {
        setModules(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch modules');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((module, idx) => (
          <div
            key={module.moduleId}
            className="rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-orange-300"
            onClick={() => navigate(`/courses/${module.moduleId}`)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${module.moduleName}`}
          >
            <div className="h-30 w-full flex items-center justify-center ">
              <img src="course.png" alt="Course" className="object-cover h-full w-full" />
            </div>
            <div className="bg-white p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-semibold text-base mb-1 truncate">{module.moduleName}</h2>
                <div className="flex flex-row gap-4 text-xs text-gray-600 mb-2">
                  <span>Credits: {module.credits}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
