"use client";

import Link from 'next/link';
import { Cross2Icon, TriangleRightIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes';
import { useForgotPassword } from '@/app/components/hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, isSubmitting, errors } = useForgotPassword();

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 text-sm">
      <div className="w-full max-w-md relative rounded-lg">
        {/* close */}
        <Link href="/sign-in" className="absolute -top-3 -right-3 bg-orange-500 hover:bg-orange-500/80 p-2 rounded-full text-white transition-colors duration-200">
          <Cross2Icon />
        </Link>

        {/* Sign In Form */}
        <div className="bg-white shadow-xl p-8 text-sm rounded-lg">˝
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Enter your email address to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full bg-white px-3 py-2 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                placeholder="Email Address"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              className="w-full h-10 rounded-md flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 font-semibold hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ?
                  <Spinner />
                :
                <span className='flex items-center gap-2'>
                  Submit Email <TriangleRightIcon />
                </span>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}