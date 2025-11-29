import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-orange-50/50">
    <Sidebar />
    <main className="flex-1 p-8">{children}</main>
  </div>
);

export default MainLayout;
