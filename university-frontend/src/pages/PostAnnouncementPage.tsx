import React, { useState, useEffect } from "react";
import { postAnnouncement } from "../services/announcementService";
import { getLecturerByEmail } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';

const departmentId = 1;

export default function PostAnnouncementPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lecturerId, setLecturerId] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (lecturerId === null) {
      setError("Lecturer not found. Cannot post announcement.");
      return;
    }
    try {
      await postAnnouncement({
        title,
        content,
        postedAt: new Date().toISOString(),
        lecturer: {
          lecturerId,
          firstName: "",
          lastName: "",
          email: "",
          department: {
            departmentId,
            departmentName: "",
            description: ""
          }
        }
      });
      setSuccess("Announcement posted successfully.");
      setTitle("");
      setContent("");
    } catch {
      setError("Failed to post announcement.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-100 to-sky-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Announcement </h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border border-gray-200 bg-sky-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Body</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Enter an announcement body"
                className="w-full border border-gray-200 bg-sky-50 p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-sky-400 hover:bg-sky-500 text-white px-8 py-2 rounded font-semibold float-right mb-10">Announce</button>
        </form>
      </div>
    </div>
  );
}
