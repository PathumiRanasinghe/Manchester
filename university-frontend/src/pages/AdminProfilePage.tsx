import { useEffect, useState } from 'react';
import { getAdminByEmail } from '../services/AdminService';
import { getKeycloak } from '../keycloak';
import { Admin } from '../types/Admin';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kc = getKeycloak();
    const email = kc.tokenParsed?.email;
    if (!email) {
      toast.error('Email not found in token');
      setLoading(false);
      return;
    }
    getAdminByEmail(email)
      .then((data: Admin) => {
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch admin details');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner className="p-8" />;
  if (!admin) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-stone-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-0 overflow-hidden flex flex-col items-center">
        <div className="w-full flex flex-col items-center pt-8 pb-4 mb-8">
          <img src="/admin.png" alt="Avatar" className="w-24 h-24  object-cover  " />
          <div className="mt-2 text-xl font-bold text-stone-500">{admin.username}</div>
          <div className="text-xs text-stone-400 mt-1">Admin</div>
        </div>
        <div className="w-full px-8 pb-8 mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Username</label>
              <div className="text-base text-gray-700 bg-stone-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-stone-400 rounded-full mr-2"></span>
                {admin.username}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
              <div className="text-base text-gray-700 bg-stone-50 rounded px-3 py-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-stone-400 rounded-full mr-2"></span>
                {admin.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
