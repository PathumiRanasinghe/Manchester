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
import useCurrentPath from '../hooks/useCurrentPath';
import { getKeycloak } from '../keycloak';
import { getLecturerByEmail } from '../services/lecturerService';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/lecturer/dashboard' },
  { label: 'My Modules', icon: BookOpenIcon, path: '/lecturer/modules' },
  { label: 'Students', icon: UsersIcon, path: '/lecturer/students' },
  { label: 'My Profile', icon: UserIcon, path: '/lecturer/profile' },
  { label: 'Log out', icon: ArrowRightIcon, path: '/logout' },
];

export default function LecturerSidebar() {
  const navigate = useNavigate();
  const currentPath = useCurrentPath();
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kc = getKeycloak();
      const email = kc.tokenParsed?.email;
      if (!email) {
        setLecturer(null);
        setLoading(false)
      }

      getLecturerByEmail(email)
        .then((data: Lecturer) => {
          setLecturer(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

  }, []);

  return (
    <aside className="bg-white w-64 shadow flex flex-col p-4 sticky top-0 h-screen">
      <div className="mb-6 flex justify-center w-full">
        <span className="text-2xl font-bold text-blue-400">MANCHESTER</span>
      </div>
      <div className="mb-8 flex flex-col items-center">
        <img src="/lecturer.png" alt="Lecturer" className="w-16 h-16 rounded-full mb-2 object-cover" />
        <div className="text-center">
          <div className="font-semibold text-blue-500">{lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : ''}</div>
          <div className="text-xs text-gray-500">{lecturer ? lecturer.email : ''}</div>
        </div>
      </div>
    <nav>
        <ul className="space-y-2">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.label}>
                {item.label === 'Log out' ? (
                  <button
                    onClick={() => navigate('/logout')}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700 w-full text-left ${isActive ? 'bg-blue-100 font-bold text-blue-600' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <a
                    href={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700 ${isActive ? 'bg-blue-100 font-bold text-blue-600' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
