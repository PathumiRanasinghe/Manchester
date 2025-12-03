import  {  useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Student } from "../types/Student";
import { getStudents } from "../services/studentService";



export const AdminStudentsPage = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudents()
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch students");
        setLoading(false);
      });
  }, []);

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

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
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
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {/* <a href="/admin/students/create" className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded font-semibold shadow flex items-center gap-2">
            <span>+ Create Student</span>
          </a> */}
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
                <tr key={student.studentId} className="border-b hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{student.firstName}</td>
                  <td className="py-3 px-4 text-gray-500">{student.lastName}</td>
                  <td className="py-3 px-4 text-gray-500">{student.email}</td>
                  <td className="py-3 px-4 text-gray-500">{student.phoneNumber}</td>
                  <td className="py-3 px-4 text-gray-500">{student.department.departmentName}</td>
                  <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                    <button className="p-2 rounded hover:bg-stone-100" title="Edit">
                      <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                    </button>
                    <button className="p-2 rounded hover:bg-stone-100" title="Delete">
                      <TrashIcon className="h-5 w-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}

 