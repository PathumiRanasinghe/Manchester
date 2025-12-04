import { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getModules } from '../services/moduleService';
import { getDepartments } from '../services/departmentService';

export const AdminModulesPage = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<any | null>(null);

  useEffect(() => {
    getModules()
      .then(data => {
        setModules(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch modules');
        setLoading(false);
      });
    getDepartments()
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch =
      module.moduleName.toLowerCase().includes(search.toLowerCase()) ||
      (module.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept ? (module.department && module.department.departmentId === Number(selectedDept)) : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6 justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Module Management</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
         <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex w-full md:w-2/3 gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              <option value="">All </option>
              {departments.map(dept => (
                <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>
              ))}
            </select>
          </div>
          {/* <a href="/admin/modules/create" className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded font-semibold shadow flex items-center gap-2">
            <span>+ Create Module</span>
          </a> */}
        </div>
        {loading ? (
          <div className="text-center py-8 text-stone-400">Loading modules...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
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
        {expandedModule && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Full Description</div>
              <div className="mb-4 text-gray-700 text-sm whitespace-pre-line">{expandedModule.description}</div>
              <button className="px-4 py-2 rounded bg-stone-500 text-white font-semibold hover:bg-stone-600" onClick={() => setExpandedModule(null)}>Close</button>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
              <div className="font-bold text-lg mb-4">Create Module</div>
                <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                setCreateSuccess(null);
                try {
                  // @ts-ignore - dynamic import extensionless for CRA dev resolver
                  const { createModule } = await import('../services/moduleService');
                  const newModule = await createModule({ moduleName, description: moduleDesc });
                  setCreateSuccess(`Module '${newModule.moduleName}' created successfully!`);
                  setModuleName("");
                  setModuleDesc("");
                  setShowCreate(false);
                } catch (err) {
                  setCreateError("Failed to create module.");
                }
              }}>
                <input type="text" placeholder="Module Name" className="border p-2 rounded w-full" value={moduleName} onChange={e => setModuleName(e.target.value)} required />
                <textarea placeholder="Description" className="border p-2 rounded w-full" value={moduleDesc} onChange={e => setModuleDesc(e.target.value)} />
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
