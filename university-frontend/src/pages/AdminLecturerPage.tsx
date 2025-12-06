
import { useState, useEffect } from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { Lecturer } from "../types/Lecturer";
import { getLecturers, deleteLecturer } from "../services/lecturerService";
import Spinner from "../components/Spinner";

export const AdminLecturerPage = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  
  const handleConfirmDelete = async () => {
    if (selectedLecturer) {
      setDeletingId(selectedLecturer.lecturerId!);
      try {
        await deleteLecturer(selectedLecturer.lecturerId!);
        setLecturers(lecturers.filter(l => l.lecturerId !== selectedLecturer.lecturerId));
        setShowConfirm(false);
        setSelectedLecturer(null);
      } catch {
        setError('Failed to delete lecturer');
      }
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedLecturer(null);
  };

  useEffect(() => {
    getLecturers()
      .then(data => {
        setLecturers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch lecturers");
        setLoading(false);
      });
  }, []);

  const departmentOptions = ["All", ...Array.from(new Set(lecturers.map(l => l.department.departmentName)))];
  const filteredLecturers = lecturers.filter(l => {
    const matchesSearch =
      l.firstName.toLowerCase().includes(search.toLowerCase()) ||
      l.lastName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || l.department.departmentName === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  if (loading) return <Spinner className="p-8" />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Lecturer Management</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex w-full md:w-2/3 gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lecturers..."
              className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <a href="/admin/create-lecturer" className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded font-semibold shadow flex items-center gap-2">
            <span>+ Create Lecturer</span>
          </a>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm border-b">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map((lecturer: Lecturer) => (
                <tr key={lecturer.lecturerId} className="border-b hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{lecturer.firstName}</td>
                  <td className="py-3 px-4 text-gray-500">{lecturer.lastName}</td>
                  <td className="py-3 px-4 text-gray-500">{lecturer.email}</td>
                  <td className="py-3 px-4 text-gray-500">{lecturer.department.departmentName}</td>
                  <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                    <button
                      className="p-2 rounded hover:bg-stone-100"
                      title="Delete"
                      disabled={deletingId === lecturer.lecturerId}
                      onClick={() => {
                        setSelectedLecturer(lecturer);
                        setShowConfirm(true);
                      }}
                    >
                      <TrashIcon className="h-5 w-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showConfirm && selectedLecturer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
            <div className="font-bold text-lg mb-4">Do you want to delete this lecturer?</div>
            <div className="mb-6 text-gray-700">This action cannot be undone.</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={handleConfirmDelete}
                disabled={deletingId === selectedLecturer.lecturerId}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
