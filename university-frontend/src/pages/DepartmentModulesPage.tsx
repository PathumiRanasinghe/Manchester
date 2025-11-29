import React, { useEffect, useState } from 'react';
import { getModulesByDepartmentId, getModulesByStudentId, Module } from '../services/moduleService';
import { getStudentById } from '../services/studentService';
import { enrollModule } from '../services/enrollmentService';

const studentId = 1;

const DepartmentModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolledModules, setEnrolledModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let departmentId: number;
    getStudentById(studentId)
      .then(student => {
        departmentId = student.departmentId;
        return Promise.all([
          getModulesByDepartmentId(departmentId),
          getModulesByStudentId(studentId)
        ]);
      })
      .then(([deptModules, enrolled]) => {
        setModules(deptModules);
        setEnrolledModules(enrolled.map(m => m.moduleId));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch modules');
        setLoading(false);
      });
  }, []);

  const handleEnrollClick = (module: Module) => {
    setSelectedModule(module);
    setShowConfirm(true);
  };

  const handleConfirmEnroll = async () => {
    if (selectedModule) {
      try {
        await enrollModule(studentId, selectedModule.moduleId);
        setSuccess('Successfully enrolled in module.');
        setEnrolledModules([...enrolledModules, selectedModule.moduleId]);
        setShowConfirm(false);
        setSelectedModule(null);
      } catch {
        setError('Failed to enroll.');
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedModule(null);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Department Modules</h1>
      {success && <div className="mb-4 text-green-500">{success}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map(module => {
          const isEnrolled = enrolledModules.includes(module.moduleId);
          return (
            <div key={module.moduleId} className="rounded-xl shadow-lg bg-white p-6 flex flex-col">
              <div className="font-semibold text-lg mb-2">{module.moduleName}</div>
              <div className="text-sm text-gray-600 mb-1">Module ID: {module.moduleId}</div>
              <div className="text-xs text-gray-500 mb-1">Credits: {module.credits}</div>
              <div className="text-xs text-gray-500 mb-1">Lecturer: {module.lecturerId}</div>
              <button
                className={`mt-4 px-4 py-1 rounded font-semibold ${isEnrolled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-400 text-white hover:bg-orange-500'}`}
                disabled={isEnrolled}
                onClick={() => !isEnrolled && handleEnrollClick(module)}
              >
                {isEnrolled ? 'Enrolled' : 'Enroll'}
              </button>
            </div>
          );
        })}
      </div>

      {showConfirm && selectedModule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
            <div className="font-bold text-lg mb-4">Do you want to enroll in this module?</div>
            <div className="mb-6 text-gray-700">This action will enroll you in the selected module.</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
                onClick={handleConfirmEnroll}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentModulesPage;
