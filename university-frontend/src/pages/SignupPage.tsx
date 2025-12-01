import React, { useState } from 'react';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-white">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden min-h-[400px]">
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Manchester Logo" className="h-12" />
            <span className="text-xl font-bold text-orange-400">MANCHESTER UNIVERSITY</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-700">Sign Up</h2>
          <p className="mb-6 text-m text-gray-500">Create your account below.</p>
          <form className="space-y-8">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-base font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-m"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-base font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-m"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-m"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-m"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-400 text-white font-bold text-xl shadow hover:bg-orange-500 transition"
            >
              Sign Up
            </button>
          </form>
      </div>
      <div className="hidden md:block md:w-1/2 relative">
          <img src="/university.jpg" alt="Campus" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}
