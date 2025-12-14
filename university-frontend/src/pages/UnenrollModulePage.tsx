import React, { useEffect, useState } from 'react';
import { getModulesByStudentId} from '../services/moduleService';
import { getEnrollmentsByStudentId } from '../services/enrollmentService';
import { getStudentByEmail } from '../services/studentService';
import { unenrollModule } from '../services/enrollmentService';
import { Enrollment } from '../types/Enrollment';
import { Module } from '../types/Module';
import { getKeycloak } from '../keycloak';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import NoDataFound from '../components/NoDataFound';

const UnenrollModulePage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setLoading(false);
      return;
    }
    getStudentByEmail(email)
      .then(student => {
        const id = student.studentId;
        if (id == null) {
          setLoading(false);
          return Promise.reject(new Error('Student ID missing'));
        }
        return Promise.all([
          getModulesByStudentId(id),
          getEnrollmentsByStudentId(id)
        ]);
      })
      .then(([mods, enrollmentsResponse]) => {
        setModules(mods);
        const enrollments = Array.isArray(enrollmentsResponse)
          ? enrollmentsResponse
          : ((enrollmentsResponse as any)?.items ?? []);
        setEnrollments(enrollments);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch enrolled modules');
        setLoading(false);
      });
  }, []);

  const handleUnenrollClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowConfirm(true);
  };

  const handleConfirmUnenroll = async () => {
    if (selectedEnrollment) {
      try {
        await unenrollModule(selectedEnrollment.enrollmentId);
        toast.success('Successfully unenrolled from module.');
        setEnrollments(enrollments.filter(e => e.enrollmentId !== selectedEnrollment.enrollmentId));
        setShowConfirm(false);
        setSelectedEnrollment(null);
      } catch {
        toast.error('Failed to unenroll.');
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedEnrollment(null);
  };

  if (loading) return <Spinner className="p-8" />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Unenroll from a Module</h1>
      <div className="mb-4 text-gray-500 text-sm">Select a module below to unenroll.</div>
        {enrollments.length === 0 ? (
          <NoDataFound message="You are not enrolled in any modules." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {enrollments.map(enrollment => {
            const module = modules.find(m => m.moduleId === enrollment.module.moduleId);
            if (!module) return null;
            return (
              <div key={enrollment.enrollmentId} className="rounded-xl shadow-lg bg-white p-6 flex flex-col">
                <div className="font-semibold text-lg mb-2">{module.moduleName}</div>
                <div className="text-sm text-gray-600 mb-1">Module ID: {module.moduleId}</div>
                <div className="text-xs text-gray-500 mb-1">Credits: {module.credits}</div>
                <div className="text-xs text-gray-500 mb-1">Lecturer: {module.lecturer.firstName} {module.lecturer.lastName}</div>
                <button
                  className="mt-4 px-4 py-1 rounded font-semibold bg-red-400 text-white hover:bg-red-500"
                  onClick={() => handleUnenrollClick(enrollment)}
                >
                  Unenroll
                </button>
              </div>
            );
          })}
        </div>
        )}

      {showConfirm && selectedEnrollment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
            <div className="font-bold text-lg mb-4">Do you want to unenroll from this module?</div>
            <div className="mb-6 text-gray-700">This action cannot be undone.</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={handleConfirmUnenroll}
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

export default UnenrollModulePage;
