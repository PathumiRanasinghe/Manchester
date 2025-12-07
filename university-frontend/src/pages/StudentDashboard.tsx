
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';
import StudentCalendar from '../components/Calendar';
import { getAnnouncementsByDepartmentId } from '../services/announcementService';
import { Announcement } from '../types/Announcement';
import { getStudentByEmail } from '../services/studentService';
import { getKeycloak } from '../keycloak';
import { Student } from '../types/Student';

export default function StudentDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setError('Email not found in token');
      setLoading(false);
      return;
    }
    getStudentByEmail(email)
      .then(studentData => {
        setStudent(studentData);
        if (studentData?.department?.departmentId) {
          return getAnnouncementsByDepartmentId(studentData.department.departmentId);
        } else {
          setAnnouncements([]);
          setLoading(false);
          return null;
        }
      })
      .then(announcementsData => {
        if (announcementsData) setAnnouncements(announcementsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch announcements or student');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f0ff] flex">
      <main className="flex-1 px-8 py-2">
        <div className="flex justify-between items-center mb-8 bg-purple-200 p-4 rounded-2xl">
          <div>
            <h1 className="text-3xl font-bold text-[#232347]">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-lg font-bold">{student?.firstName?.[0] || '?'}</div>
            <p className="text-gray-500">{student ? `${student.firstName} ${student.lastName}` : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="font-semibold mb-4 text-[#232347] text-lg">Announcements</div>
            {loading ? (
              <Spinner className="py-8" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : announcements.length === 0 ? (
              <div className="text-gray-400">No announcements available.</div>
            ) : (
              <ul className="space-y-4">
                {announcements.map(a => (
                  <li key={a.id} className="border-b pb-2">
                    <div className="font-semibold text-purple-500">{a.title}</div>
                    <div className="text-gray-700 text-sm mb-1">{a.content}</div>
                    <div className="text-xs text-gray-400">Posted at: {new Date(a.postedAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white bg-opacity-50 rounded-xl shadow p-6">
            <StudentCalendar />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
            <div className="font-semibold mb-4 text-[#232347] text-lg">Enroll to a Module</div>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <BookOpenIcon className="h-10 w-10 text-purple-500" />
              </div>
              <div className="text-xs text-gray-500 mb-2 text-center">Browse and enroll in modules available in your department.</div>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                onClick={() => window.location.href = '/department-modules'}
              >
                View Department Modules
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
            <div className="font-semibold mb-4 text-[#232347] text-lg">Unenroll from a Module</div>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <BookOpenIcon className="h-10 w-10 text-purple-500" />
              </div>
              <div className="text-xs text-gray-500 mb-2 text-center">You can unenroll from a module that you enrolled in.</div>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                onClick={() => window.location.href = '/unenroll-module'}
              >
                Unenroll Module
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
