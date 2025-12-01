import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  UsersIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Lecturer } from '../types/Lecturer';
import { getLecturerById } from '../services/lecturerService';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/lecturer/dashboard' },
  { label: 'My Modules', icon: BookOpenIcon, path: '/lecturer/modules' },
  { label: 'Students', icon: UsersIcon, path: '/lecturer/students' },
  { label: 'My Profile', icon: UserIcon, path: '/lecturer/profile' },
  { label: 'Log out', icon: ArrowRightIcon, path: '/' },
];

export default function LecturerSidebar() {
  const navigate = useNavigate();

  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  useEffect(() => {
    getLecturerById(2)
        .then((data: Lecturer) => setLecturer(data))
        .catch(() => setLecturer(null));
  }, []);

  return (
    <aside className="bg-white h-screen w-64 shadow flex flex-col justify-between p-4">
      <div>
        <div className="mt-4 mb-8 flex justify-center w-full">
          <span className="text-2xl font-bold text-blue-400">MANCHESTER</span>
        </div>
        <div className="mt-8 mb-8 flex flex-col items-center">
          <img src="/lecturer.png" alt="Lecturer" className="w-16 h-16 rounded-full mb-2 object-cover" />
          <div className="text-center">
            <div className="font-semibold text-blue-500">{lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : ''}</div>
            <div className="text-xs text-gray-500">{lecturer ? lecturer.email : ''}</div>
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.label}>
                {item.label === 'Log out' ? (
                  <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700 w-full text-left`}
                  >
                    <item.icon className="h-6 w-6 text-blue-400" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <a
                    href={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700`}
                  >
                    <item.icon className="h-6 w-6 text-blue-400" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
