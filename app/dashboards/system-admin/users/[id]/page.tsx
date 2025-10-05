"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, Phone, User, CreditCard, Eye, EyeOff, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { TriangleLeftIcon } from "@radix-ui/react-icons";
import { useUsers } from "@/app/components/hooks/useUser";
import { Spinner } from "@radix-ui/themes";
import { useUpdateUser } from "@/app/components/hooks/useUpdateUser";

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  userType: string;
  image: string | null;
  shoes: any[];
  isDisplayed: boolean;
  isDisplayedStartDate: string | null;
  isDisplayedEndDate: string | null;
  isDisplayedMonthsPayed: number | null;
  isSubscriptionActive: boolean;
  subscriptionMonths: number | null;
  subscriptionPayedOn: string | null;
  daysUntilDisplayExpires: number | null;
  daysUntilSubscriptionExpires: number | null;
  expiringWhen: string | null;
  dateCreated: string;
}

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required');
          router.push('/sign-in');
          return;
        }

        const response = await axios.get(
          `${getApiUrl(API_ENDPOINTS.USER.SINGLE(params.id as string))}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setUser(response.data.data.user);
      } catch (error) {
        handleApiError(error, {
          onAuthFailure: () => {
            localStorage.removeItem('token');
            router.push('/sign-in');
          }
        });
        toast.error('Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isActive
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-sm">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-4">The user you're looking for doesn't exist.</p>
          <Link
            href="/dashboards/system-admin/users"
            className="inline-flex items-center gap-2 px-4 py-[8px] rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-orange-600 transition-colors"
          >
            <TriangleLeftIcon className="w-4 h-4" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboards/system-admin/users"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <TriangleLeftIcon />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 flex items-center gap-2">User ID: <div className="font-semibold bg-orange-500/5 text-orange-500 rounded-full px-2 py-1 w-[80px] flex items-center justify-center">{user.id}</div></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(user.isSubscriptionActive)}
          <span className="text-sm text-gray-500 capitalize">{user.userType}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><User strokeWidth={1.5} size={16} /></span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <p className="text-gray-900 font-semibold">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-semibold">{user.phoneNumber}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Account Created
                  </label>
                  <p className="text-gray-900 font-semibold">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 font-semibold">{formatDate(user.updatedAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">User Type</label>
                  <p className="text-gray-900 font-semibold capitalize">{user.userType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Display Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><CreditCard strokeWidth={1.5} size={16} /></span>
              Subscription & Display Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Subscription</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    {getStatusBadge(user.isSubscriptionActive)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Months</span>
                    <span className="text-gray-900">{user.subscriptionMonths || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Payment Date</span>
                    <span className="text-gray-900">
                      {user.subscriptionPayedOn ? formatDate(user.subscriptionPayedOn) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Days Until Expiry</span>
                    <span className="text-gray-900">{user.daysUntilSubscriptionExpires || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Display Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Display</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    {getStatusBadge(user.isDisplayed)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Start Date</span>
                    <span className="text-gray-900">
                      {user.isDisplayedStartDate ? formatDate(user.isDisplayedStartDate) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">End Date</span>
                    <span className="text-gray-900">
                      {user.isDisplayedEndDate ? formatDate(user.isDisplayedEndDate) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Months Paid</span>
                    <span className="text-gray-900">{user.isDisplayedMonthsPayed || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shoes Collection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><Package strokeWidth={1.5} size={16} /></span>
              Shoes Collection
            </h2>
            {user.shoes && user.shoes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.shoes.map((shoe, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{shoe.name || `Shoe ${index + 1}`}</h4>
                    <p className="text-sm text-gray-500">Brand: {shoe.brand || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Price: ${shoe.price || 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No shoes in collection</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Shoes</span>
                <span className="font-semibold text-gray-900">{user.shoes?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Account Age</span>
                <span className="font-semibold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subscription Status</span>
                <span className={`font-semibold ${user.isSubscriptionActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isSubscriptionActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Display Status</span>
                <span className={`font-semibold ${user.isDisplayed ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isDisplayed ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setIsEditingSubscription(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors">
                <CreditCard strokeWidth={1.5} size={16} />
                Update Subscription
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                <Package className="w-4 h-4" />
                View Shoes
              </button>
            </div>
          </div>

          {/* Expiry Information */}
          {(user.daysUntilDisplayExpires || user.daysUntilSubscriptionExpires) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Expiry Information
              </h3>
              <div className="space-y-3">
                {user.daysUntilDisplayExpires && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Display Expires</p>
                    <p className="text-xs text-yellow-600">{user.daysUntilDisplayExpires} days remaining</p>
                  </div>
                )}
                {user.daysUntilSubscriptionExpires && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Subscription Expires</p>
                    <p className="text-xs text-red-600">{user.daysUntilSubscriptionExpires} days remaining</p>
                  </div>
                )}
                {user.expiringWhen && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Next Expiry</p>
                    <p className="text-xs text-blue-600">{formatDate(user.expiringWhen)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isEditingSubscription && <EditSubscriptionModal setIsEditingSubscription={setIsEditingSubscription} user={user} />}
    </div>
  );
}

export const EditSubscriptionModal = ({ setIsEditingSubscription, user }: { setIsEditingSubscription: (isEditingSubscription: boolean) => void } & { user: UserDetail }) => {
  const { register, handleSubmit, reset, errors, isSubmitting, onSubmit, isUpdatingUser } = useUpdateUser();
  
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><CreditCard strokeWidth={1.5} size={16} /></span>
          Update Subscription
        </h2>
        <h1 className="text-gray-900 flex items-center gap-2 my-5">User Name: <span className="font-semibold bg-orange-500/5 text-orange-500 rounded-full px-4 py-1 h-8 flex items-center justify-center capitalize">{user.name || <Spinner />}</span></h1>
        <div className="space-y-3">
          <span className="text-sm text-gray-500">Months</span>
          <input type="number" className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none" {...register('subscriptionMonths')} />
          {errors.subscriptionMonths && <p className="text-red-500 text-xs">{errors.subscriptionMonths.message}</p>}
        </div>
        <div className="mt-3">
          <span className="text-sm text-gray-500">Payment Date</span>
          <input type="date" className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none" {...register('subscriptionPayedOn')} />
          {errors.subscriptionPayedOn && <p className="text-red-500 text-xs">{errors.subscriptionPayedOn.message}</p>}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={() => setIsEditingSubscription(false)} className="w-full flex text-black items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
            <XCircle strokeWidth={1.5} size={16} />
            Cancel
          </button>
        <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors">
          {isSubmitting ? <Spinner /> : <CreditCard strokeWidth={1.5} size={16} />}
          Update Subscription
        </button>
        </div>
      </form>
    </div>
  );
};

