'use client';

import { useCreateUser } from '@/app/components/hooks/useUser';
import { ArrowLeftIcon, TriangleLeftIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes';
import { Building, Mail, Shield, User, UserPen } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function CreateSellerPage() {
    const { register, handleSubmit, errors, isSubmitting, onSubmit, isLoading, reset, setError } = useCreateUser();
    const randomPassword = "Account@123";
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-50 py-8 text-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-wrap w-full items-center gap-3 justify-between">
                        <div>
                            <h1 className="text-3xl text-gray-900">Create New Seller</h1>
                            <p className="text-gray-600 mt-1">Add a new seller to the platform</p>
                        </div>
                        <button onClick={() => router.back()} className='flex items-center gap-2 bg-orange-500/10 text-orange-500 h-12 px-6 cursor-pointer border border-white hover:border hover:border-orange-500/90 rounded-full transition-colors duration-150'>
                        <TriangleLeftIcon />
                        Back
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <span className='p-2 bg-orange-500/5 text-orange-500 rounded-full'>
                            <User strokeWidth={1.5} size={16} />
                            </span>
                            <h2 className="font-medium text-lg text-gray-900">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-[1px] focus:border-none focus:ring-orange-500 transition-colors"
                                    placeholder="Enter full name"
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-[1px] focus:border-none focus:ring-orange-500 transition-colors"
                                    placeholder="Enter email address"
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-[1px] focus:border-none focus:ring-orange-500 transition-colors"
                                    placeholder="Enter phone number"
                                    {...register('phoneNumber')}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-[1px] focus:border-none focus:ring-orange-500 transition-colors"
                                    placeholder={randomPassword}
                                    value={randomPassword}
                                    readOnly
                                    {...register('password')}
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 pt-6">
                           
                            <button
                                type="submit"
                                className="px-8 h-12 w-[150px] flex items-center justify-center rounded-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors gap-2"
                                disabled={isLoading}
                            >
                             {isLoading ? <Spinner /> : <span>Submit Info</span>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}