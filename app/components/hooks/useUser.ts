'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod"
import { useRouter } from "next/navigation";

const validationSchema = z.object({

    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isSubscriptionActive: boolean;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive' | 'pending';
    role?: string;
}

export type CreateUserFormData = z.infer<typeof validationSchema>;


export const useUsers = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },

    } = useForm<CreateUserFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
        }
    })

    const [isSubmit, setIsSubmit] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [users, setUsers] = useState<User[]>([])
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [profile, setProfile] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const onSubmit = async (data: CreateUserFormData) => {

        setIsSubmit(true)
        try {
            const createUserUrl = getApiUrl(API_ENDPOINTS.USER.CREATE);
            const token = localStorage.getItem('token');
            if (!token) {
                // This is a client-side validation, so we keep a generic message
                toast.error('Authentication required. Please log in to create a seller.');
                setIsSubmit(false)
                return
            }
            const response = await axios.post(createUserUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status >= 200 && response.status < 300) {
                // Use backend success message if available
                const successMessage = response.data?.message || 'Seller created successfully';
                toast.success(successMessage);
                reset()
            } else {
                // Use backend error message if available
                const errorMessage = response.data?.message || response.data?.error || 'Failed to create a seller';
                toast.error(errorMessage);
            }

        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmit(false)
        }
    }


    const fetchUsers = async () => {
        setIsFetching(true)
        try {
            const usersUrl = getApiUrl(API_ENDPOINTS.USER.LIST);
            const token = localStorage.getItem('token');
            if (!token) {
                // This is a client-side validation, so we keep a generic message
                toast.error('Authentication required. Please log in to fetch users.');
                setIsFetching(false)
                return
            }
            const response = await axios.get(usersUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log("The response is", response.data)
            setUsers(response.data?.data?.users)


            if (response.status >= 200 && response.status < 300) {
                // Success - no need to show toast for data fetching
                // toast.success('Users fetched successfully')
            } else {
                // Use backend error message if available
                const errorMessage = response.data?.message || response.data?.error || 'Failed to fetch users';
                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsFetching(false)
        }
    }

  

    const showProfile = async () => {
        setIsLoadingProfile(true);
        try {
            const profileUrl = getApiUrl(API_ENDPOINTS.USER.PROFILE);
            const token = localStorage.getItem('token');
            if (!token) {
                // This is a client-side validation, so we keep a generic message
                toast.error('Authentication required. Please log in to show profile.');
                return
            }
            const response = await axios.get(profileUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setProfile(response.data.data.user)
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoadingProfile(false)
        }
    }


    const logout = async () => {
        try {
            // Try to call logout endpoint if it exists
            const logoutUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGOUT);
            const token = localStorage.getItem('token');
            
            if (token) {
                await axios.post(logoutUrl, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch {
            // Even if logout fails on backend, we still logout locally
            console.log('Backend logout failed, proceeding with local logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            router.push('/');
            toast.success('Logged out successfully');
        }
    }

    // Check authentication status
    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        return !!token;
    }

    useEffect(() => {
        const hasToken = checkAuthStatus();
        if (hasToken) {
            fetchUsers()
            showProfile()
        }
    }, [])

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmit,
        isFetching,
        onSubmit,
        reset,
        users,
        profile,
        isLoadingProfile,
        showProfile,
        logout,
        isAuthenticated,
        checkAuthStatus
    }
}