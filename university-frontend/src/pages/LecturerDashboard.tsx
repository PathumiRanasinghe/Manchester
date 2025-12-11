import { useEffect, useState } from "react";
import Spinner from '../components/Spinner';
import { getAnnouncementsByLecturerId, deleteAnnouncement } from '../services/announcementService';
import { AnnouncementDto } from '../types/AnnouncementDto';
import { Lecturer } from "../types/Lecturer";
import { getLecturerByEmail } from "../services/lecturerService";
import { getKeycloak } from '../keycloak';
import StudentCalendar from '../components/Calendar';


export default function LecturerDashboard() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setLoading(false);
      return;
    }
    getLecturerByEmail(email)
      .then(lecturer => {
        return Promise.all([
          getAnnouncementsByLecturerId(lecturer.lecturerId),
          Promise.resolve(lecturer)
        ]);
      })
      .then(([announcementsData, lecturerData]) => {
        setAnnouncements(announcementsData);
        setLecturer(lecturerData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteAnnouncementObj, setDeleteAnnouncementObj] = useState<any | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (announcement: any) => {
    setDeleteAnnouncementObj(announcement);
    setShowDelete(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteAnnouncementObj) {
      try {
        await deleteAnnouncement(deleteAnnouncementObj.id);
        setAnnouncements(announcements.filter(a => a.id !== deleteAnnouncementObj.id));
        setShowDelete(false);
        setDeleteAnnouncementObj(null);
      } catch {
        setDeleteError('Failed to delete announcement.');
      }
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
                <Spinner className="py-8" />
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
                        onClick={() => handleDeleteClick(a)}
                      >
                        Delete
                      </button>
                          {showDelete && deleteAnnouncementObj && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                              <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
                                <div className="font-bold text-lg mb-4">Do you want to delete this announcement?</div>
                                <div className="mb-6 text-gray-700">This action cannot be undone.</div>
                                {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
                                <div className="flex gap-4">
                                  <button
                                    className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                                    onClick={handleConfirmDelete}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                                    onClick={() => {
                                      setShowDelete(false);
                                      setDeleteAnnouncementObj(null);
                                    }}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="mt-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
              onClick={() => window.location.href = '/create-announcement'}
            >Post Announcement</button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <StudentCalendar />
          </div>

      
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="font-semibold text-lg text-sky-700 mt-5 mb-2">Create Module</div>
              <div className="mb-4 text-center text-gray-600">Add a new module to your department.</div>
              <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                onClick={() => window.location.href = '/create-module'}
              >Create Module</button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="font-semibold text-lg text-sky-700 mb-2">Feedback & Support</div>
              <div className="mb-2 text-gray-600 text-center">
                Need help or want to share feedback? Contact your admin:
              </div>
              <div className="mb-2 text-gray-800 text-center">
                <span className="font-semibold">Admin Name:</span> Chathura Alwis<br />
                <span className="font-semibold">Email:</span> chathura@gmail.com<br />
                <span className="font-semibold">Phone:</span> 0712345678
              </div>
             
            </div>
          </div>
        
      </main>
    </div>
  );
}
