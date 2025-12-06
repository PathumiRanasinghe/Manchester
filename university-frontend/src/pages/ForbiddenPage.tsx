
import React, { useEffect, useState } from 'react';

export default function ForbiddenPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/';
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white font-sans">
      <div className="w-full max-w-2xl flex flex-col items-center mt-12">
        <div className="relative w-full flex justify-center items-center select-none">
          <span className="text-[7rem] md:text-[10rem] font-bold text-purple-200 leading-none">4</span>
          <svg width="96" height="140" viewBox="0 0 96 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2 md:mx-4 h-[90px] md:h-[120px]">
            <ellipse cx="48" cy="70" rx="46" ry="68" fill="#fff" stroke="#a78bfa" strokeWidth="4" />
            <rect x="28" y="40" width="40" height="70" rx="8" fill="#ede9fe" stroke="#a78bfa" strokeWidth="3" />
            <circle cx="68" cy="75" r="2.5" fill="#a78bfa" />
            <rect x="45" y="90" width="6" height="20" rx="3" fill="#a78bfa" />
            <rect x="46.5" y="60" width="3" height="18" rx="1.5" fill="#a78bfa" />
          </svg>
          <span className="text-[7rem] md:text-[10rem] font-bold text-purple-200 leading-none">3</span>
        </div>
        <div className="text-center mt-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">You're not permitted to see this.</h1>
          <p className="text-gray-500 mb-1">The page you're trying to access has restricted access.</p>
          <p className="text-gray-400 mb-6">If you feel this is a mistake, contact your admin.</p>
          <div className="mb-4 text-purple-500 text-sm">Redirecting to your home page in {countdown}...</div>
          {/* <button
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded transition-colors duration-200 shadow-md"
          >
            RETURN HOME
          </button> */}
        </div>
      </div>
    </div>
  );
}
