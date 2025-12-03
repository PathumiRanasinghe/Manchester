import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import useCurrentPath from '../hooks/useCurrentPath';
import { Admin } from '../types/Admin';
import { getAdminById } from '../services/AdminService';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/admins/dashboard' },
  { label: 'Students', icon: UsersIcon, path: '/admins/students' },
  { label: 'Lecturers', icon: UsersIcon, path: '/admins/lecturers' },
  { label: 'Departments', icon: BuildingOfficeIcon, path: '/admins/departments' },
  { label: 'Modules', icon: BookOpenIcon, path: '/admins/modules' },
  { label: 'My Profile', icon: UserIcon, path: '/admins/profile' },
  { label: 'Log out', icon: ArrowRightIcon, path: '/' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const currentPath = useCurrentPath();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    getAdminById(1)
        .then((data: Admin) => setAdmin(data))
        .catch(() => setAdmin(null));
},[]);

  return (
    <aside className="bg-white h-screen w-64 shadow flex flex-col p-4">
      <div className="mt-4 mb-6 flex justify-center w-full">
        <span className="text-2xl font-bold text-stone-400">MANCHESTER</span>
      </div>
      <div className="mb-6 flex flex-col items-center">
        <img src="/admin.png" alt="Admin" className="w-16 h-16  mb-5 object-cover" />
        <div className="text-center">
          <div className="font-semibold text-stone-500">{admin ? `${admin.username}` : ''}</div>
          <div className="text-xs text-gray-500">{admin ? admin.email : ''}</div>
        </div>
      </div>      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.label}>
                {item.label === 'Log out' ? (
                  <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 text-gray-700 w-full text-left ${isActive ? 'bg-stone-100 font-bold text-stone-500' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-stone-500' : 'text-stone-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 text-gray-700 w-full text-left ${isActive ? 'bg-stone-100 font-bold text-stone-500' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-stone-500' : 'text-stone-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
