import React, { useState } from 'react';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-white">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden min-h-[600px]">
      
        <div className="w-full md:w-1/2 bg-white p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo.png" alt="Manchester Logo" className="h-12" />
            <span className="text-2xl font-bold text-orange-400">MANCHESTER UNIVERSITY</span>
          </div>
          <h2 className="text-4xl font-bold mb-3 text-gray-700">Welcome back</h2>
          <p className="mb-8 text-lg text-gray-500">Please enter your details.</p>
          <form className="space-y-8">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Login With Your Username</label>
              <input
                type="text"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                placeholder="Please enter your username"
                value={id}
                onChange={e => setId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                  placeholder="Please enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3 text-gray-400 hover:text-orange-400"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41M6.1 6.1A9.96 9.96 0 002 12c0 5.523 4.477 10 10 10 1.657 0 3.22-.336 4.6-.94" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-400 text-white font-bold text-xl shadow hover:bg-orange-500 transition"
            >
              Sign in
            </button>
          </form>
          <div className="mt-6 text-center">
            <button type="button" className="text-base text-orange-500 hover:underline bg-transparent border-none p-0 cursor-pointer">
              Dont have an account? Sign Up
            </button>
          </div>
          <div className="mt-10 text-sm text-gray-400 text-center">
            manchesterstudents.com &nbsp;•&nbsp; Technical Support &nbsp;•&nbsp; Terms &nbsp;•&nbsp; Privacy 
          </div>
        </div>
        
        <div className="hidden md:block md:w-1/2 relative">
          <img src="/university.jpg" alt="Campus" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}
