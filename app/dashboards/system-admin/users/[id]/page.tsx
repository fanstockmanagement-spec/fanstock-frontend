"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Mail, Phone, User, CreditCard, Eye, Clock, CheckCircle, XCircle, Shield } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { TriangleLeftIcon } from "@radix-ui/react-icons";
import { Spinner } from "@radix-ui/themes";
import { useUpdateUser } from "@/app/components/hooks/useUpdateUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateDisplayStatus } from "@/app/components/hooks/useUpdateDisplayStatus";

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  userType: string;
  image: string | null;
  shoes: unknown[];
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
  const [isEditingDisplayStatus, setIsEditingDisplayStatus] = useState(false);
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
          <p className="text-gray-500 mb-4">The user you&apos;re looking for doesn&apos;t exist.</p>
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
      <div className="mb-8 bg-gray-50 p-4 rounded-xl flex justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => router.push('/dashboards/system-admin/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <TriangleLeftIcon />
            <h2 className="text-md font-medium">Go back</h2>
          </button>

        </div>
        <div>
          <p className="text-gray-500 flex items-center gap-2">User ID: <div className="font-semibold bg-orange-500/5 text-orange-500 rounded-full px-2 py-1 w-[80px] flex items-center justify-center">{user.id}</div></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card - Left Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {/* Profile Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${user.isSubscriptionActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {user.isSubscriptionActive ? (
                  <><CheckCircle className="w-4 h-4 mr-1" /> Active</>
                ) : (
                  <><XCircle className="w-4 h-4 mr-1" /> Inactive</>
                )}
              </span>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-1">
                  <div className=" bg-blue-50 rounded-full p-2 text-blue-500 flex items-center justify-center">
                    <Mail strokeWidth={1.5} size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                </div>
                <span className="text-sm text-gray-900 font-medium text-right max-w-[200px] break-all">{user.email}</span>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-1">
                    <div className=" bg-green-50 rounded-full p-2 text-green-500 flex items-center justify-center">
                      <Phone strokeWidth={1.5} size={14} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{user.phoneNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-1">
                  <div className=" bg-purple-50 rounded-full p-2 text-purple-500 flex items-center justify-center">
                    <Calendar strokeWidth={1.5} size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Joined:</span>
                </div>
                <span className="text-sm text-gray-900 font-medium">{formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-1">
                  <div className=" bg-orange-50 rounded-full p-2 text-orange-500 flex items-center justify-center">
                    <Shield strokeWidth={1.5} size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">User Type:</span>
                </div>
                <span className="text-sm text-gray-900 font-medium capitalize">{user.userType}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-1">
                  <div className=" bg-gray-50 rounded-full p-2 text-gray-500 flex items-center justify-center">
                    <Calendar strokeWidth={1.5} size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                </div>
                <span className="text-sm text-gray-900 font-medium">{formatDate(user.updatedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 w-full mt-3">
              <button onClick={() => setIsEditingSubscription(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors">
                <CreditCard strokeWidth={1.5} size={16} />
                Update Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Content - Right Side */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50">
              <TabsTrigger value="subscription" className="flex items-center gap-2 p-2">
                <CreditCard className="w-4 h-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2 p-2">
                <Eye className="w-4 h-4" />
                Display Status
              </TabsTrigger>
              <TabsTrigger value="expiry" className="flex items-center gap-2 p-2">
                <Clock className="w-4 h-4" />
                Expiry Info
              </TabsTrigger>
            </TabsList>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><CreditCard strokeWidth={1.5} size={16} /></span>
                  Subscription Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Status</span>
                    </div>
                    {getStatusBadge(user.isSubscriptionActive)}
                  </div>

                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Months</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{user.subscriptionMonths || 'N/A'}</span>
                  </div>

                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Payment Date</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {user.subscriptionPayedOn ? formatDate(user.subscriptionPayedOn) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Days Until Expiry</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{user.daysUntilSubscriptionExpires || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Display Status Tab */}
            <TabsContent value="display" className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><Eye strokeWidth={1.5} size={16} /></span>
                  Display Status Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Status</span>
                    </div>
                    {getStatusBadge(user.isDisplayed)}
                  </div>

                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Start Date</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {user.isDisplayedStartDate ? formatDate(user.isDisplayedStartDate) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">End Date</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {user.isDisplayedEndDate ? formatDate(user.isDisplayedEndDate) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Months Paid</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{user.isDisplayedMonthsPayed || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button onClick={() => setIsEditingDisplayStatus(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors">
                    <Eye strokeWidth={1.5} size={16} />
                    Update Display Status
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Expiry Information Tab */}
            <TabsContent value="expiry" className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><Clock strokeWidth={1.5} size={16} /></span>
                  Expiry Information
                </h3>

                {(user.daysUntilDisplayExpires || user.daysUntilSubscriptionExpires) ? (
                  <div className="space-y-4">
                    {user.daysUntilDisplayExpires && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium text-yellow-800">Display Expires</span>
                        </div>
                        <p className="text-sm text-yellow-600 ml-11">{user.daysUntilDisplayExpires} days remaining</p>
                      </div>
                    )}

                    {user.daysUntilSubscriptionExpires && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-sm font-medium text-red-800">Subscription Expires</span>
                        </div>
                        <p className="text-sm text-red-600 ml-11">{user.daysUntilSubscriptionExpires} days remaining</p>
                      </div>
                    )}

                    {user.expiringWhen && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-blue-800">Next Expiry</span>
                        </div>
                        <p className="text-sm text-blue-600 ml-11">{formatDate(user.expiringWhen)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No expiry information available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {isEditingSubscription && <EditSubscriptionModal setIsEditingSubscription={setIsEditingSubscription} user={user} />}
      {isEditingDisplayStatus && <EditDisplayStatusModal setIsEditingDisplayStatus={setIsEditingDisplayStatus} user={user} />}
    </div>
  );
}

export const EditSubscriptionModal = ({ setIsEditingSubscription, user }: { setIsEditingSubscription: (isEditingSubscription: boolean) => void } & { user: UserDetail }) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useUpdateUser();

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

export const EditDisplayStatusModal = ({ setIsEditingDisplayStatus, user }: { setIsEditingDisplayStatus: (isEditingDisplayStatus: boolean) => void } & { user: UserDetail }) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useUpdateDisplayStatus();

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><Eye strokeWidth={1.5} size={16} /></span>
          Update Display Status
        </h2>
        <h1 className="text-gray-900 flex items-center gap-2 my-5">User Name: <span className="font-semibold bg-orange-500/5 text-orange-500 rounded-full px-4 py-1 h-8 flex items-center justify-center capitalize">{user.name || <Spinner />}</span></h1>
        <div className="space-y-3">
          <span className="text-sm text-gray-500">Months Payed</span>
          <input type="number" className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none" {...register('isDisplayedMonthsPayed')} />
          {errors.isDisplayedMonthsPayed && <p className="text-red-500 text-xs">{errors.isDisplayedMonthsPayed.message}</p>}
        </div>
        <div className="mt-3">
          <span className="text-sm text-gray-500">Payment Date</span>
          <input type="date" className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none" {...register('isDisplayedStartDate')} />
          {errors.isDisplayedStartDate && <p className="text-red-500 text-xs">{errors.isDisplayedStartDate.message}</p>}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={() => setIsEditingDisplayStatus(false)} className="w-full flex text-black items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
            <XCircle strokeWidth={1.5} size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center whitespace-nowrap gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors">
            {isSubmitting ? <Spinner /> : <Eye strokeWidth={1.5} size={16} />}
            Update Display Status
          </button>
        </div>
      </form>
    </div>
  );
};
