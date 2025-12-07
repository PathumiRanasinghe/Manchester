import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Spinner from '../components/Spinner';
import api from '../services/api';
import { Enrollment } from '../types/Enrollment';

export default function AdminEnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    api.get('/enrollments')
      .then(res => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch enrollments');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6 justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Enrollments</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="mb-6 flex w-full md:w-2/3 gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or module..."
            className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        {loading ? (
          <Spinner className="p-8" />
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm border-b">
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.filter(e => {
                  const s = search.toLowerCase();
                  return (
                    e.module.moduleName.toLowerCase().includes(s) ||
                    e.student.firstName.toLowerCase().includes(s) ||
                    e.student.lastName.toLowerCase().includes(s) ||
                    e.student.email.toLowerCase().includes(s)
                  );
                }).map(e => (
                  <tr key={e.enrollmentId} className="border-b hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{e.module.moduleName}</td>
                    <td className="py-3 px-4 text-gray-500">{e.student.firstName} {e.student.lastName} </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(e.enrollmentDate).toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-2 rounded hover:bg-stone-100" title="Delete Enrollment" onClick={() => {
                        setDeleteId(e.enrollmentId);
                        setShowDelete(true);
                        setDeleteError(null);
                      }}>
                        <TrashIcon className="h-5 w-5 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDelete && deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
            <div className="font-bold text-lg mb-4">Do you want to delete this enrollment?</div>
            <div className="mb-6 text-gray-700">This action cannot be undone.</div>
            {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={async () => {
                  try {
                    await api.delete(`/enrollments/${deleteId}`);
                    setEnrollments(enrollments.filter(e => e.enrollmentId !== deleteId));
                    setShowDelete(false);
                    setDeleteId(null);
                  } catch {
                    setDeleteError('Failed to delete enrollment.');
                  }
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                onClick={() => {
                  setShowDelete(false);
                  setDeleteId(null);
                }}
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
