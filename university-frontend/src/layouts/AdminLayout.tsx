import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-stone-50/50">
    <AdminSidebar />
    <main className="flex-1 p-8">{children}</main>
  </div>
);

export default AdminLayout;