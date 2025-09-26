"use client";

import { useState } from 'react';
import Link from 'next/link';
import { EyeOpenIcon, EyeClosedIcon, Cross2Icon, TriangleRightIcon } from '@radix-ui/react-icons';

export default function SignInPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center   justify-center p-4 text-sm">
      <div className="w-full max-w-md relative ">
        {/* close */}
        <Link href="/" className="absolute -top-3 -right-3 bg-[#CA425A] hover:bg-[#bd3e55] p-2 rounded-full text-white transition-colors duration-200">
          <Cross2Icon />
        </Link>

        {/* Sign In Form */}
        <div className="bg-white shadow-xl p-8">˝
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign In
          </h1>

          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-white p-3 border border-gray-200 focus:border-1 focus:border-[#CA425A] transition-all duration-200 outline-none"
                placeholder="Email Address"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-200 focus:border-1 focus:border-[#CA425A] transition-all duration-200 outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#CA425A] border-gray-300 rounded focus:ring-[#CA425A]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#CA425A] hover:text-[#CA425A]/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Link
              href="/dashboards/seller"
              className="w-full flex items-center justify-center gap-2 bg-[#CA425A] text-white p-3 font-semibold hover:bg-[#CA425A]/90 focus:bg-[#bd3e55] cursor-pointer transition-all duration-200"
            >
              Sign In <TriangleRightIcon />
            </Link>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/sign-up"
                className="text-[#CA425A] hover:text-[#CA425A]/80 transition-colors duration-200"
              >
                Request Account Creation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}