import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLecturerByEmail, getModulesByLecturerId } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';
import { Module } from '../types/Module';

export default function LecturerModulesPage() {
  const [courses, setCourses] = useState<Module[]>([]);
  const [lecturerId, setLecturerId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setLecturerId(null);
      return;
    }
    getLecturerByEmail(email)
      .then(lecturer => setLecturerId(lecturer.lecturerId))
      .catch(() => setLecturerId(null));
  }, []);

  useEffect(() => {
    if (lecturerId) {
      getModulesByLecturerId(lecturerId)
        .then((data: Module[]) => setCourses(data))
        .catch(() => setCourses([]));
    }
  }, [lecturerId]);

  return (
    <div className="p-4 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">My Modules</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.moduleId}
            className="rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-blue-300"
            onClick={() => navigate(`/lecturer/modules/${course.moduleId}`)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${course.moduleName}`}
          >
            <div className="h-30 w-full flex items-center justify-center">
              <img src="/lecturercourse.png" alt="Course" className="object-cover h-full w-full" />
            </div>
            <div className="bg-white p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-semibold text-base mb-1 truncate text-blue-700">{course.moduleName}</h2>
                <div className="flex flex-row gap-4 text-xs text-gray-600 mb-2">
                  <span>Credits: {course.credits}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
