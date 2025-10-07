"use client";

import { useState, useEffect } from "react";
import {
    User,
    Phone,
    Calendar,
    Eye,
    EyeOff,
    Save,
    Key,
    AlertCircle,
    CheckCircle,
    Lock,
    Settings,
    UserCog
} from "lucide-react";
import { useUsers } from "@/app/components/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Password change validation schema
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

export default function ProfilePage() {
    const { profile, isLoadingProfile, showProfile } = useUsers();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile edit form
    const profileForm = useForm({
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            isSubscriptionActive: false,
        }
    });

    // Password change form
    const passwordForm = useForm<PasswordChangeData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    useEffect(() => {
        if (profile) {
            profileForm.reset({
                name: profile.name || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                isSubscriptionActive: profile.isSubscriptionActive || false,
            });
        }
    }, [profile, profileForm]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleProfileUpdate = async (data: { name: string; email: string; phoneNumber: string }) => {
        setIsUpdatingProfile(true);
        try {
            const response = await axios.put(
                `${getApiUrl(API_ENDPOINTS.USER.UPDATE_PROFILE)}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully');
                showProfile(); // Refresh profile data
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordChange = async (data: PasswordChangeData) => {
        setIsUpdatingPassword(true);
        try {
            const response = await axios.put(
                `${getApiUrl(API_ENDPOINTS.USER.CHANGE_PASSWORD)}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Password changed successfully');
                passwordForm.reset();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="h-96 bg-gray-200 rounded-lg"></div>
                        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6 text-center flex flex-col items-center gap-2">
                <AlertCircle strokeWidth={1.5} size={64} color="gray" />
                <h2 className="text-xl font-semibold text-gray-600">Profile Not Found</h2>
                <p className="text-gray-500">Unable to load your profile information.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto text-sm">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account information and security settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* User Card - Left Side */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                        {/* Profile Avatar */}
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-600">{profile.email}</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${profile.isSubscriptionActive === true
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {profile.isSubscriptionActive === true ? (
                                    <><CheckCircle className="w-4 h-4 mr-1" /> Active</>
                                ) : (
                                    <><AlertCircle className="w-4 h-4 mr-1" /> Inactive</>
                                )}
                            </span>
                        </div>

                        {/* User Details */}
                        <div className="space-y-3">


                            {profile.phoneNumber && (
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className=" bg-green-50 rounded-full p-2 text-green-500 flex items-center justify-center">
                                            <Phone strokeWidth={1.5} size={14} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Phone</span>
                                    </div>
                                    <span className="text-sm text-gray-900 font-medium">{profile.phoneNumber}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className=" bg-purple-50 rounded-full p-2 text-purple-500 flex items-center justify-center">
                                        <Calendar strokeWidth={1.5} size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Joined</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{formatDate(profile.createdAt)}</span>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <div className=" bg-gray-50 rounded-full p-2 text-gray-500 flex items-center justify-center">
                                        <Calendar strokeWidth={1.5} size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{formatDate(profile.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Content - Right Side */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-50">
                            <TabsTrigger value="profile" className="flex items-center gap-2 p-2">
                                <UserCog className="w-4 h-4" />
                                Profile Settings
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2 p-2">
                                <Lock className="w-4 h-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Settings Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full">
                                        <Settings strokeWidth={1.5} size={16} />

                                    </span>
                                    Update Profile Information
                                </h3>

                                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                {...profileForm.register('name')}
                                                className="w-full px-3 py-2 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                                placeholder="Enter your full name"
                                            />
                                            {profileForm.formState.errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                {...profileForm.register('email')}
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                                placeholder="Enter your email"
                                            />
                                            {profileForm.formState.errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            {...profileForm.register('phoneNumber')}
                                            className="w-full px-3 py-2 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                            placeholder="Enter your phone number"
                                        />
                                        {profileForm.formState.errors.phoneNumber && (
                                            <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.phoneNumber.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingProfile}
                                            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full">
                                        <Lock strokeWidth={1.5} size={16} />
                                    </span>
                                    Change Password
                                </h3>

                                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                {...passwordForm.register('currentPassword')}
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                className="w-full px-3 py-2 pr-12 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.currentPassword && (
                                            <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <div className="relative">
                                                <input
                                                    {...passwordForm.register('newPassword')}
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    className="w-full px-3 py-2 pr-12 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.formState.errors.newPassword && (
                                                <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    {...passwordForm.register('confirmPassword')}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className="w-full px-3 py-2 pr-12 border border-gray-200 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.formState.errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <Key className="w-4 h-4" />
                                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>

                                {/* Security Tips */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2">Security Tips</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Use a strong, unique password with at least 8 characters</li>
                                        <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                                        <li>• Don&apos;t share your password with anyone</li>
                                        <li>• Change your password regularly</li>
                                        <li>• Use different passwords for different accounts</li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}