import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay, parseISO } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';
import Spinner from '../components/Spinner';
import { getPaginatedEnrollments, unenrollModule } from '../services/enrollmentService';
import { Enrollment } from '../types/Enrollment';
import { getDepartments } from '../services/departmentService';
import { Department } from '../types/Department';
import { toast } from 'react-toastify';

export default function AdminEnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    getPaginatedEnrollments(page, pageSize)
      .then(data => {
        setEnrollments(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch enrollments');
        setLoading(false);
      });
    getDepartments().then(data => setDepartments(data.items)).catch(() => setDepartments([]));
  }, [page, pageSize]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6 justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Enrollments</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="mb-6 flex w-full md:w-full gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or module..."
            className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept.departmentId} value={dept.departmentName}>{dept.departmentName}</option>
            ))}
          </select>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            isClearable
            placeholderText="Filter by date"
            className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        {loading ? (
          <Spinner className="p-8" />
          ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm border-b">
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments
                  .filter(e => {
                    const s = search.toLowerCase();
                    const matchesSearch =
                      e.module.moduleName.toLowerCase().includes(s) ||
                      e.student.firstName.toLowerCase().includes(s) ||
                      e.student.lastName.toLowerCase().includes(s) ||
                      e.student.email.toLowerCase().includes(s);
                    const matchesDept =
                      selectedDept === 'All' || (e.module.department && e.module.department.departmentName === selectedDept);
                    let enrollmentDateObj: Date;
                    if (typeof e.enrollmentDate === 'string') {
                      enrollmentDateObj = parseISO(e.enrollmentDate);
                    } else {
                      enrollmentDateObj = e.enrollmentDate;
                    }
                    const matchesDate =
                      !selectedDate || isSameDay(enrollmentDateObj, selectedDate);
                    return matchesSearch && matchesDept && matchesDate;
                  })
                  .map(e => (
                    <tr key={e.enrollmentId} className="border-b hover:bg-stone-50">
                      <td className="py-3 px-4 font-medium text-gray-700">{e.module.moduleName}</td>
                      <td className="py-3 px-4 text-gray-500">{e.student.firstName} {e.student.lastName} </td>
                      <td className="py-3 px-4 text-gray-500">{e.module.department ? e.module.department.departmentName : '-'}</td>
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
            <div className="flex justify-between items-center px-8 pt-3 pb-6">
              <div>
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="px-3 py-1 rounded border bg-stone-100 disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  className="px-3 py-1 rounded border bg-stone-100 disabled:opacity-50"
                  disabled={page * pageSize >= total}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
              <select
                className="ml-2 border rounded p-1"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map(size => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            </div>
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
                    await unenrollModule(deleteId);
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
