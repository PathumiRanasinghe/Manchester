import  {  useState, useEffect } from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { Student } from "../types/Student";
import { getStudents } from "../services/studentService";
import Spinner from "../components/Spinner";
import { deleteStudent } from "../services/studentService";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

export const AdminStudentsPage = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getStudents(page, pageSize)
      .then(data => {
        setStudents(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch students");
        setLoading(false);
      });
  }, [page, pageSize]);

  const departmentOptions = ["All", ...Array.from(new Set(students.map(s => s.department.departmentName)))];
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || s.department.departmentName === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleConfirmDelete = async () => {
    if (selectedStudent && selectedStudent.studentId !== undefined) {
      setDeletingId(selectedStudent.studentId);
      try {
        await deleteStudent(selectedStudent.studentId);
        setStudents(students.filter(s => s.studentId !== selectedStudent.studentId));
        setShowConfirm(false);
        setSelectedStudent(null);
        toast.success('Student deleted successfully!');
      } catch {
        toast.error('Failed to delete student');
      }
      setDeletingId(null);
    } else {
      toast.error('Invalid student ID. Cannot delete.');
      setShowConfirm(false);
      setSelectedStudent(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedStudent(null);
  };

    if (loading) return <Spinner className="p-8" />;
    return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Student Management</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex w-full md:w-2/3 gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              {departmentOptions.map((dept, idx) => (
                <option key={dept + '-' + idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <a href="/admin/create-student" className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded font-semibold shadow flex items-center gap-2">
            <span>+ Create Student</span>
          </a>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm border-b">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student: Student) => (
                <tr key={student.studentId ?? student.email} className="border-b hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{student.firstName}</td>
                  <td className="py-3 px-4 text-gray-500">{student.lastName}</td>
                  <td className="py-3 px-4 text-gray-500">{student.email}</td>
                  <td className="py-3 px-4 text-gray-500">{student.phoneNumber}</td>
                  <td className="py-3 px-4 text-gray-500">{student.department.departmentName}</td>
                  <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                    <button
                      className="p-2 rounded hover:bg-stone-100"
                      title="Delete"
                      disabled={deletingId === student.studentId || student.studentId === undefined}
                      onClick={() => {
                        if (student.studentId !== undefined) {
                          setSelectedStudent(student);
                          setShowConfirm(true);
                        } else {
                          toast.error('Invalid student ID. Cannot delete.');
                        }
                      }}
                    >
                      <TrashIcon className="h-5 w-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={size => { setPageSize(size); setPage(1); }}
                  />
        </div>
      </div>
      {showConfirm && selectedStudent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
      <div className="font-bold text-lg mb-4">Do you want to delete this student?</div>
      <div className="mb-6 text-gray-700">This action cannot be undone.</div>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
          onClick={handleConfirmDelete}
          disabled={deletingId === selectedStudent.studentId}
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

