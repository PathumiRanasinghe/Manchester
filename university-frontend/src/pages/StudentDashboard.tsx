import { BookOpenIcon } from '@heroicons/react/24/outline';
import Spinner from '../components/Spinner';
import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../services/announcementService';
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
    console.log('Keycloak tokenParsed:', kc.tokenParsed);

    if (!email) {
      setError('Email not found in token');
      setLoading(false);
      return;
    }

    Promise.all([
      getAnnouncements(),
      getStudentByEmail(email)
    ])
      .then(([announcementsData, studentData]) => {
        setAnnouncements(announcementsData);
        setStudent(studentData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch announcements or student');
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex-1 p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-700">Dashboard</h1>
      <p className="mb-6 text-gray-500">
        Welcome back{student ? `, ${student.firstName}` : ''}!
      </p>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6 ">
          <div className="font-semibold mb-4 text-gray-700">Announcements</div>
          {loading ? (
            <Spinner className="py-8" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : announcements.length === 0 ? (
            <div className="text-gray-500">No announcements available.</div>
          ) : (
            <ul className="space-y-4">
              {announcements.map(a => (
                <li key={a.id} className="border-b pb-2">
                  <div className="font-semibold text-orange-700">{a.title}</div>
                  <div className="text-gray-700 text-sm mb-1">{a.content}</div>
                  <div className="text-xs text-gray-400">Posted at: {new Date(a.postedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
              <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-lg text-stone-700 mb-4">Calendar</div>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FColombo"
              style={{ border: 0 }}
              width="100%"
              height="300"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <div className="font-semibold mb-4 text-gray-700">Enroll to a Module</div>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <BookOpenIcon className="h-10 w-10 text-orange-500" />
              </div>
              <div className="text-xs text-gray-500 mb-2 text-center">Browse and enroll in modules available in your department.</div>
              <button
                className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
                onClick={() => window.location.href = '/department-modules'}
              >
                View Department Modules
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <div className="font-semibold mb-4 text-gray-700">Unenroll from a Module</div>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <BookOpenIcon className="h-10 w-10 text-red-500" />
              </div>
              <div className="text-xs text-gray-500 mb-2 text-center">You can unenroll from a module within 2 weeks of enrollment.</div>
              <button
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                onClick={() => window.location.href = '/unenroll-module'}
              >
                Unenroll Module
              </button>
            </div>
          </div>
        </div>
        
      </main>
  );
}
