import React, { useEffect, useState } from 'react';
import { getLecturerByEmail, getModulesByLecturerId, getStudentsByModuleId } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';
import { Module } from '../types/Module';
import { Student } from '../types/Student';

export default function LecturerStudentsPage() {
  const [lecturerId, setLecturerId] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

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
        .then(setModules)
        .catch(() => setModules([]));
    }
  }, [lecturerId]);

  useEffect(() => {
    if (selectedModuleId) {
      setLoading(true);
      getStudentsByModuleId(selectedModuleId)
        .then(setStudents)
        .catch(() => setStudents([]))
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [selectedModuleId]);

  return (
    <div className="flex min-h-screen ">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">My Students</h1>
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Module:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedModuleId ?? ''}
            onChange={e => setSelectedModuleId(Number(e.target.value))}
          >
            <option value="">-- Select Module --</option>
            {modules.map(module => (
              <option key={module.moduleId} value={module.moduleId}>{module.moduleName}</option>
            ))}
          </select>
        </div>
        {selectedModuleId && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Students for Module</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="py-2 px-4 text-left">Index Number</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.studentId} className="border-b">
                      <td className="py-2 px-4">{student.studentId}</td>
                      <td className="py-2 px-4">{student.firstName} {student.lastName}</td>
                      <td className="py-2 px-4">{student.email}</td>
                      <td className="py-2 px-4">{student.phoneNumber}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-400">No students enrolled for this module.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
