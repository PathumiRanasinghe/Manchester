import React, { useState, useEffect } from "react";
import { createModule } from "../services/moduleService";
import { getLecturerByEmail } from '../services/lecturerService';
import { getKeycloak } from '../keycloak';

const departmentId = 1;

const CreateModule = () => {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState<number>();
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
    try {
      await createModule({
        moduleName,
        description,
        credits,
        department: {
            departmentId,
            departmentName: "",
            description: ""
          },
        lecturer: {
          lecturerId,
          firstName: "",
          lastName: "",
          email: "",     
        }
      } as any);
      setSuccess("Module created successfully.");
      setModuleName("");
      setDescription("");
      setCredits(undefined);
    } catch {
      setError("Failed to create module.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-100 to-sky-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create Module</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Fill in the details and press create. This will add a new module to the system.</p>
        </div>
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Module Name</label>
              <input
                value={moduleName}
                onChange={e => setModuleName(e.target.value)}
                placeholder="Module Name"
                className="w-full border border-gray-200 bg-sky-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Credits</label>
              <input
                type="number"
                min={1}
                value={credits === undefined ? "" : credits}
                onChange={e => setCredits(Number(e.target.value))}
                placeholder="Credits"
                className="w-full border border-gray-200 bg-sky-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border border-gray-200 bg-sky-50 p-2 rounded h-20 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>
         
          <button type="submit" className="bg-sky-400 hover:bg-sky-500 text-white px-8 py-2 rounded font-semibold float-right mb-10">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateModule;