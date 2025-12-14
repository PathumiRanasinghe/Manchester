import { useState, useEffect } from "react";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { getDepartments, updateDepartment, deleteDepartment } from '../services/departmentService';
import Spinner from "../components/Spinner";
import { createDepartment } from "../services/departmentService";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

export const AdminDepartmentPage = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [editDept, setEditDept] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteDept, setDeleteDept] = useState<any | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getDepartments(page, pageSize)
      .then(data => {
        setDepartments(Array.isArray(data.items) ? data.items : []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch departments');
        setDepartments([]);
        setLoading(false);
      });
  }, [page, pageSize]);

  const filteredDepartments = Array.isArray(departments)
    ? departments.filter(dept => {
        const matchesSearch =
          dept.departmentName.toLowerCase().includes(search.toLowerCase()) ||
          dept.description.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
      })
    : [];

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
          <Spinner className="p-8" />
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
                      <button className="p-2 rounded hover:bg-stone-100" title="Edit" onClick={() => {
                        setEditDept(dept);
                        setEditName(dept.departmentName);
                        setEditDesc(dept.description);
                        setEditError(null);
                        setEditSuccess(null);
                      }}>
                        <PencilSquareIcon className="h-5 w-5 text-blue-400" />
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
        )}
        {showDelete && deleteDept && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Do you want to delete this department?</div>
              <div className="mb-6 text-gray-700">This action cannot be undone.</div>
              {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                  onClick={async () => {
                    try {
                      await deleteDepartment(deleteDept.departmentId);
                      setDepartments(departments.filter(d => d.departmentId !== deleteDept.departmentId));
                      setShowDelete(false);
                      setDeleteDept(null);
                    } catch {
                      setDeleteError('Failed to delete department.');
                    }
                  }}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                  onClick={() => {
                    setShowDelete(false);
                    setDeleteDept(null);
                  }}
                >
                  No
                </button>
              </div>
            </div>
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
                  const newDept = await createDepartment({ departmentName: deptName, description: deptDesc });
                  setCreateSuccess(`Department '${newDept.departmentName}' created successfully!`);
                  setDeptName("");
                  setDeptDesc("");
                  setShowCreate(false);
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
        {editDept && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Edit Department</div>
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                setEditError(null);
                setEditSuccess(null);
                try {
                  const deptId = editDept.departmentId ?? editDept.id;
                  console.log('Updating department with ID:', deptId, editDept);
                  if (!deptId) {
                    setEditError('Department ID is missing. Cannot update.');
                    return;
                  }
                  const updated = await updateDepartment(deptId, { departmentName: editName, description: editDesc });
                  setEditSuccess(`Department '${updated.departmentName}' updated successfully!`);
                  getDepartments()
                    .then(data => setDepartments(data))
                    .catch(() => {});
                  setEditDept(null);
                } catch (err) {
                  setEditError("Failed to update department.");
                }
              }}>
                <label className="block text-gray-500 font-medium">Department Name</label>
                <input type="text" placeholder="Department Name" className="border p-2 rounded w-full" value={editName} onChange={e => setEditName(e.target.value)} required />
                <label className="block text-gray-500 font-medium">Description</label>
                <textarea placeholder="Description" className="border p-2 rounded w-full" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                {editError && <div className="text-red-500 text-sm">{editError}</div>}
                {editSuccess && <div className="text-green-500 text-sm">{editSuccess}</div>}
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">Update</button>
                  <button type="button" className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400" onClick={() => setEditDept(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
