import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '../components/PasswordEyeIcons';
import { getDepartments } from '../services/departmentService';
import { Department } from '../types/Department';
import { createStudent } from '../services/studentService';
import { toast } from 'react-toastify';

export default function AdminCreateStudentPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [passwordError, setPasswordError] = useState(false);
  const [deptError, setDeptError] = useState(false);

 useEffect(() => {
  getDepartments().then(data => setDepartments(data.items || [])).catch(() => setDepartments([]));
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(false);
    setDeptError(false);
    if (!departmentId) {
      setDeptError(true);
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>/?]).+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }
    try {
      await createStudent({ firstName, lastName, email, password, phoneNumber, departmentId });
      toast.success('Student created successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setDepartmentId('');
    } catch (err: any) {
      if (err?.response?.status === 409 || (typeof err?.response?.data === 'string' && err.response.data.toLowerCase().includes('email'))) {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Failed to create student. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-100 to-stone-300 h-32 flex items-end px-8 pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create Student</h2>
      </div>
      <div className="px-8 pt-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Fill in the details and press create. This will add a new student to the system.</p>
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                pattern='07[0-9]{8}'
                minLength={10}
                maxLength={10}
                title="Phone number must start with '07' followed by 8 digits."
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Password"
                  className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400 pr-10"
                  required
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
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
                onChange={e => { setDepartmentId(e.target.value); setDeptError(false); }}
                required
                className="w-full border border-gray-200 bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-stone-400"
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.departmentId ?? dep.departmentName} value={dep.departmentId}>{dep.departmentName}</option>
                ))}
              </select>
              {deptError && (
                <div className="absolute left-0 mt-2 mb-2 flex items-center z-10">
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center shadow border border-orange-300 text-sm">
                    <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 102 0 1 1 0 00-2 0zm.293-7.707a1 1 0 00-1.414 1.414L9.586 9.586A2 2 0 1012 12a1 1 0 100-2 1 1 0 00-1-1H9a1 1 0 110-2h1a1 1 0 01.707.293z" clipRule="evenodd" /></svg>
                    Please select an item in the list.
                  </span>
                </div>
              )}

            
            </div>
          </div>
          <button type="submit" className="bg-stone-400 hover:bg-stone-500 text-white px-8 py-2 rounded font-semibold float-right mb-10">Create</button>
        </form>
      </div>
    </div>
  );
}
