
import { useEffect, useState } from "react";
import { getAnnouncements, deleteAnnouncement } from '../services/announcementService';
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <div className="mb-6 text-gray-500">Welcome back {lecturer ? `, ${lecturer.firstName}` : ''}!</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-semibold text-lg  mb-2">Announcements</div>
            <div className="mb-4">
              {loading ? (
                <div>Loading...</div>
              ) : announcements.length === 0 ? (
                <div className="text-gray-400">No announcements found.</div>
              ) : (
                announcements.map(a => (
                  <div key={a.id} className="mb-4 border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sky-600 font-bold">{a.title}</div>
                        <div className="text-gray-700 text-sm">{a.content}</div>
                        <div className="text-xs text-gray-400">Posted at: {new Date(a.postedAt).toLocaleString()}</div>
                      </div>
                      <button
                        className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="mt-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
            onClick={()=> window.location.href='/create-announcement'}
            >Post Announcement</button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="font-semibold text-lg text-sky-700 mb-2">Create Module</div>
            <div className="mb-4 text-center text-gray-600">Add a new module to your department.</div>
            <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
            onClick={()=> window.location.href='/create-module'}
            >Create Module</button>
          </div>
        </div>
      </main>
    </div>
  );
}
