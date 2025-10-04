"use client";

import { useState } from 'react';
import Link from 'next/link';
import { EyeOpenIcon, EyeClosedIcon, Cross2Icon, TriangleRightIcon } from '@radix-ui/react-icons';
import { useSignin } from '@/app/components/hooks/useSignin';
import { Spinner } from '@radix-ui/themes';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, isLoading } = useSignin();

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 text-sm">
      <div className="w-full max-w-md relative rounded-lg">
        {/* close */}
        <Link href="/" className="absolute -top-3 -right-3 bg-orange-500 hover:bg-orange-500/80 p-2 rounded-full text-white transition-colors duration-200">
          <Cross2Icon />
        </Link>

        {/* Sign In Form */}
        <div className="bg-white shadow-xl p-8 text-sm">˝
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-white p-3 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                placeholder="Email Address"
                {...register('email')}
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
                  className="w-full p-3 pr-12 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                  placeholder="Enter your password"
                  {...register('password')}
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
                className="text-sm text-orange-500 hover:text-orange-500/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-white p-3 font-semibold hover:bg-[#CA425A]/90 focus:bg-[#bd3e55] cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ?
                  <Spinner />
                :
                <span className='flex items-center gap-2'>
                  Sign In <TriangleRightIcon />
                </span>
              }
            </button>
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