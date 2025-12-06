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
    <aside className="bg-white w-64 shadow flex flex-col p-4 sticky top-0 h-screen">
      <div className="mb-6 flex justify-center w-full">
        <span className="text-2xl font-bold text-orange-400">MANCHESTER</span>
      </div>
      <div className="mb-8 flex flex-col items-center">
        <img src="/student.png" alt="Logo" className="w-16 h-16 rounded-full mb-2 object-cover" />
        <div className="text-center">
          <div className="font-semibold text-orange-500">{student ? `${student.firstName} ${student.lastName}` : ''}</div>
          <div className="text-xs text-orange-500">{student ? student.email : ''}</div>
          <div className="text-xs text-orange-500">{student ? student.phoneNumber : ''}</div>
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
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 text-orange-700 w-full text-left ${isActive ? 'bg-orange-100 font-bold text-orange-600' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-orange-600' : 'text-orange-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <a
                    href={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 text-orange-700 ${isActive ? 'bg-orange-100 font-bold text-orange-600' : ''}`}
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-orange-600' : 'text-orange-400'}`} />
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
