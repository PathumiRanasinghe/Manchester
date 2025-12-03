import { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getDepartments } from '../services/departmentService';

export const AdminDepartmentPage = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDepartments()
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch departments');
        setLoading(false);
      });
  }, []);

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch =
      dept.departmentName.toLowerCase().includes(search.toLowerCase()) ||
      dept.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6 justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Department Management</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
         <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex w-full md:w-2/3 gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <button
            type="button"
            className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded font-semibold shadow flex items-center gap-2"
            onClick={() => setShowCreate(true)}
          >
            <span>+ Create Department</span>
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-stone-400">Loading departments...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm border-b">
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map(dept => (
                  <tr key={dept.departmentId} className="border-b hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{dept.departmentName}</td>
                    <td className="py-3 px-4 text-gray-500">{dept.description}</td>
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
        )}

        {showCreate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Create Department</div>
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                setCreateSuccess(null);
                try {
                  const { createDepartment } = await import('../services/departmentService');
                  const newDept = await createDepartment({ departmentName: deptName, description: deptDesc });
                  setCreateSuccess(`Department '${newDept.departmentName}' created successfully!`);
                  setDeptName("");
                  setDeptDesc("");
                  setShowCreate(false);
                  // Refresh department list
                  getDepartments()
                    .then(data => setDepartments(data))
                    .catch(() => {});
                } catch (err) {
                  setCreateError("Failed to create department.");
                }
              }}>
                <input type="text" placeholder="Department Name" className="border p-2 rounded w-full" value={deptName} onChange={e => setDeptName(e.target.value)} required />
                <textarea placeholder="Description" className="border p-2 rounded w-full" value={deptDesc} onChange={e => setDeptDesc(e.target.value)} />
                {createError && <div className="text-red-500 text-sm">{createError}</div>}
                {createSuccess && <div className="text-green-500 text-sm">{createSuccess}</div>}
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="px-4 py-2 rounded bg-stone-500 text-white font-semibold hover:bg-stone-600">Create</button>
                  <button type="button" className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400" onClick={() => setShowCreate(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
