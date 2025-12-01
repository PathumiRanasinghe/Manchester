
import { useEffect, useState } from "react";
import CalendarWidget from "../components/CalendarWidget";
import { getAnnouncements } from '../services/announcementService';
import { Announcement } from '../types/Announcement';
import { Lecturer } from "../types/Lecturer";
import { getLecturerById } from "../services/lecturerService";


export default function LecturerDashboard() {
  const lecturerId = 2;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [lecturer, setLecturer] = useState<Lecturer|null>(null);

  useEffect(() => {
    Promise.all([
      getAnnouncements(),
      getLecturerById(2)
    ])
      .then(([announcementsData, lecturerData]) => {
        setAnnouncements(announcementsData.filter(a => a.lecturer.lecturerId === lecturerId));
        setLecturer(lecturerData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lecturerId]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <div className="mb-6 text-gray-500">Welcome back {lecturer ? `, ${lecturer.firstName}` : ''}!</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-semibold text-lg text-sky-700 mb-2">Announcements</div>
            <div className="mb-4">
              {loading ? (
                <div>Loading...</div>
              ) : announcements.length === 0 ? (
                <div className="text-gray-400">No announcements found.</div>
              ) : (
                announcements.map(a => (
                  <div key={a.id} className="mb-4">
                    <div className="text-sky-600 font-bold">{a.title}</div>
                    <div className="text-gray-700">{a.content}</div>
                    <div className="text-xs text-gray-400">Posted at: {new Date(a.postedAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
            <button className="mt-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Post Announcement</button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4 text-gray-700">Calendar</div>
            <CalendarWidget />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="font-semibold text-lg text-sky-700 mb-2">Create Module</div>
            <div className="mb-4 text-center text-gray-600">Add a new module to your department.</div>
            <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Create Module</button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="font-semibold text-lg text-sky-700 mb-2">Create Assignment</div>
            <div className="mb-4 text-center text-gray-600">Assign coursework to your students.</div>
            <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Create Assignment</button>
          </div>
        </div>
      </main>
    </div>
  );
}
