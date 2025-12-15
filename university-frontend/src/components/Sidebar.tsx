import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentPath from '../hooks/useCurrentPath';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getStudentByEmail } from '../services/studentService';
import { getKeycloak } from '../keycloak';
import { Student } from '../types/Student';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { label: 'My Modules', icon: BookOpenIcon, path: '/modules' },
  { label: 'My Profile', icon: UserIcon, path: '/profile' },
  { label: 'Log out', icon: ArrowRightIcon, path: '/logout' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const currentPath = useCurrentPath();

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      setStudent(null);
      return;
    }
    getStudentByEmail(email)
      .then((data: Student) => setStudent(data))
      .catch(() => setStudent(null));
  }, []);

  return (
    <aside className="w-64 shadow flex flex-col p-4 sticky top-0 h-screen bg-[#232347] text-white justify-between">
      <div>
        <div className="mt-5 mb-12 flex justify-center w-full">
          <span className="text-2xl font-bold text-purple-200 tracking-wide">MANCHESTER</span>
        </div>    
        <nav>
          <ul className="space-y-4">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <li key={item.label}>
                  {item.label === 'Log out' ? (
                    <button
                      onClick={() => navigate('/logout')}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-purple-700 text-white w-full text-left ${isActive ? 'bg-purple-100 font-bold text-white' : ''}`}
                    >
                      <item.icon className={`h-6 w-6 ${isActive ? 'text-purple-600' : 'text-white'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <a
                      href={item.path}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-purple-700 text-white ${isActive ? 'bg-purple-400 font-bold text-purple-600' : ''}`}
                    >
                      <item.icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-white'}`} />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="mb-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-lg font-bold">{student?.firstName?.[0] || '?'}</div>
        <div className="ml-3">
          <div className="font-semibold">{student?.firstName || 'Student'}</div>
          <div className="text-xs text-purple-100">{student?.email || ''}</div>
        </div>
      </div>
    </aside>
  );
}
