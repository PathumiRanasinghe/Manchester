import React, { useState, useEffect } from "react";
import { createLecturer } from "../services/lecturerService";
import { getDepartments } from "../services/departmentService";
import { Department } from "../types/Department";
import { toast } from 'react-toastify';

export default function AdminCreateLecturerPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [passwordError, setPasswordError] = useState(false);

useEffect(() => {
  getDepartments().then(data => setDepartments(data.items || [])).catch(() => setDepartments([]));
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(false);
    if (!departmentId) {
      toast.error("Please select a department.");
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>/?]).+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }
    try {
      await createLecturer({ firstName, lastName, email, password, departmentId: Number(departmentId) });
      toast.success("Lecturer created successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setDepartmentId("");
    } catch (err: any) {
      if (err?.response?.status === 409 || (typeof err?.response?.data === 'string' && err.response.data.toLowerCase().includes('email'))) {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Failed to create lecturer. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create Lecturer</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Fill in the details and press create. This will add a new lecturer to the system.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="manchester@gmail.com"
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                placeholder="Password"
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
              {passwordError && (
                <div className="absolute left-0 mt-2 flex items-center z-10">
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center shadow border border-orange-300 text-sm">
                    Password must contain at least one symbol and one digit.
                  </span>
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">Department</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                required
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.departmentId} value={dep.departmentId}>{dep.departmentName}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-stone-400 hover:bg-stone-500 text-white px-8 py-2 rounded font-semibold float-right mb-10">Create</button>
        </form>
      </div>
    </div>
  );
}
