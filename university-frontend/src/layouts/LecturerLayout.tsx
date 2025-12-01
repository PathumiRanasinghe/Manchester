import React from 'react';
import LecturerSidebar from '../components/LecturerSidebar';

const LecturerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-blue-50/50">
    <LecturerSidebar />
    <main className="flex-1 p-8">{children}</main>
  </div>
);

export default LecturerLayout;