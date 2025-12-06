import React from 'react';
import Sidebar from '../components/Sidebar';

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-[#f3f0ff]">
    <Sidebar />
    <main className="flex-1 p-8">{children}</main>
  </div>
);

export default StudentLayout;