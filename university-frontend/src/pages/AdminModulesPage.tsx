import { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getModules, updateModule, deleteModule } from '../services/moduleService';
import {getLecturersByDepartmentId } from '../services/lecturerService';
import { getEnrollmentsByModuleId } from '../services/enrollmentService';
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

export const AdminModulesPage = () => {
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<any | null>(null);
  const [editModule, setEditModule] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCredits, setEditCredits] = useState<number | null>(null);
  const [editLecturers, setEditLecturers] = useState<any[]>([]);
  const [editLecturerId, setEditLecturerId] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteModuleObj, setDeleteModuleObj] = useState<any | null>(null);
  const [enrolledCount, setEnrolledCount] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getModules(page, pageSize)
      .then((data) => {
        setModules(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch modules');
        setLoading(false);
      });
  }, [page, pageSize]);

  const departmentOptions = ["All Departments", ...Array.from(new Set(modules.map(m => m.department?.departmentName).filter(Boolean)))];

  const filteredModules = modules.filter(module => {
    const matchesSearch =
      module.moduleName.toLowerCase().includes(search.toLowerCase()) ||
      (module.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      selectedDept === "All" || (module.department && module.department.departmentName === selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
  
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6 justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Module Management</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
         <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex w-full md:w-full gap-5">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search modules by module name or description ..."
              className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <Spinner className="p-8" />
  ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm border-b">
                  <th className="py-3 px-4">Module Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Lecturer</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map(module => (
                  <tr key={module.moduleId} className="border-b hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{module.moduleName}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {module.description && module.description.length > 60 ? (
                        <>
                          {module.description.slice(0, 60)}...
                          <button className="ml-2 text-stone-500 underline text-xs" onClick={() => setExpandedModule(module)}>Expand</button>
                        </>
                      ) : (
                        module.description
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{module.credits}</td>
                    <td className="py-3 px-4 text-gray-500">{module.lecturer ? `${module.lecturer.firstName} ${module.lecturer.lastName}` : '-'}</td>
                    <td className="py-3 px-4 text-gray-500">{module.department ? module.department.departmentName : '-'}</td>
                    <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                      <button className="p-2 rounded hover:bg-stone-100" title="Edit" onClick={async () => {
                        setEditModule(module);
                        setEditName(module.moduleName);
                        setEditDesc(module.description);
                        setEditCredits(module.credits);
                        setEditLecturerId(module.lecturer ? module.lecturer.lecturerId : null);
                        const deptId = module.department?.departmentId;
                        if (deptId) {
                          try {
                            const deptLecturers = await getLecturersByDepartmentId(deptId);
                            setEditLecturers(deptLecturers);
                          } catch (err) {
                            setEditLecturers([]);
                          }
                        } else {
                          toast.warning('No department associated with this module.');
                          setEditLecturers([]);
                        }
                      }}>
                        <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                      </button>
                      <button className="p-2 rounded hover:bg-stone-100" title="Delete" onClick={async () => {
                        setDeleteModuleObj(module);
                        setShowDelete(true);
                        const enrollments = await getEnrollmentsByModuleId(module.moduleId);
                        setEnrolledCount(enrollments.length);
                      }}>
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
        )}
        {expandedModule && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Full Description</div>
              <div className="mb-4 text-gray-700 text-sm whitespace-pre-line">{expandedModule.description}</div>
              <button className="px-4 py-2 rounded bg-stone-500 text-white font-semibold hover:bg-stone-600" onClick={() => setExpandedModule(null)}>Close</button>
            </div>
          </div>
        )}

        {editModule && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Edit Module</div>
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const updated = await updateModule(editModule.moduleId, {
                    moduleName: editName,
                    description: editDesc,
                    credits: editCredits ?? undefined,
                    lecturerId: editLecturerId !== null ? editLecturerId : undefined
                  });
                  toast.success(`Module '${updated.moduleName}' updated successfully!`);
                  setModules(modules.map(m => m.moduleId === updated.moduleId ? updated : m));
                  setEditModule(null);
                } catch (err) {
                  toast.error("Failed to update module.");
                }
              }}>
                <label className="block text-gray-500 font-medium">Module Name</label>
                <input type="text" placeholder="Module Name" className="border p-2 rounded w-full" value={editName} onChange={e => setEditName(e.target.value)} required />
                <label className="block text-gray-500 font-medium">Description</label>
                <textarea placeholder="Description" className="border p-2 rounded w-full" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                <label className="block text-gray-500 font-medium">Credits</label>
                <input type="number" min={1} placeholder="Credits" className="border p-2 rounded w-full" value={editCredits === null ? '' : editCredits} onChange={e => setEditCredits(e.target.value ? Number(e.target.value) : null)} />
                <label className="block text-gray-500 font-medium">Lecturer</label>
                <select className="border p-2 rounded w-full" value={editLecturerId ?? ''} onChange={e => setEditLecturerId(e.target.value ? Number(e.target.value) : null)} required>
                  <option value="">Select Lecturer</option>
                  {editLecturers.length === 0 && <option disabled>No lecturers found for this department</option>}
                  {editLecturers.map((l, idx) => (
                    <option key={String(l.lecturerId) + '-' + idx} value={l.lecturerId}>{l.firstName} {l.lastName}</option>
                  ))}
                </select>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">Update</button>
                  <button type="button" className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400" onClick={() => { setEditModule(null); setEditLecturers([]); }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDelete && deleteModuleObj && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center relative">
              {enrolledCount !== null && enrolledCount > 0 ? (
                <>
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                    onClick={() => {
                      setShowDelete(false);
                      setDeleteModuleObj(null);
                      setEnrolledCount(null);
                    }}
                  >
                    &times;
                  </button>
                  <div className="font-bold text-lg mb-4">This module cannot be deleted.</div>
                  <div className="mb-4 text-red-500 font-semibold">There are {enrolledCount} student(s) enrolled in this module. Please unenroll them before deleting.</div>
                  <div className="mb-6 text-gray-700">This action cannot be undone.</div>
                </>
              ) : (
                <>
                  <div className="font-bold text-lg mb-4">Do you want to delete this module?</div>
                  <div className="mb-6 text-gray-700">This action cannot be undone.</div>
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600"
                      onClick={async () => {
                        try {
                          await deleteModule(deleteModuleObj.moduleId);
                          setModules(modules.filter(m => m.moduleId !== deleteModuleObj.moduleId));
                          setShowDelete(false);
                          setDeleteModuleObj(null);
                          setEnrolledCount(null);
                          toast.success('Module deleted successfully.');
                        } catch {
                          toast.error('Failed to delete module.');
                        }
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
                      onClick={() => {
                        setShowDelete(false);
                        setDeleteModuleObj(null);
                        setEnrolledCount(null);
                      }}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
