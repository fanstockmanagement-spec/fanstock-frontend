'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


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




export const useSellerProfile = () => {
    const router = useRouter();
  

   
    const [isLoadingSellerProfile, setIsLoadingSellerProfile] = useState(false)
    const [sellerProfile, setSellerProfile] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const showProfile = async () => {
        setIsLoadingSellerProfile(true);
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
            setSellerProfile(response.data.data.user)
        } catch (error) {
            handleApiError(error, {
                onAuthFailure: () => {
                    localStorage.removeItem('token');
                }
            });
        } finally {
            setIsLoadingSellerProfile(false)
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
            showProfile()
        }
    }, [])

    return {
        sellerProfile,
        isLoadingSellerProfile,
        showProfile,
        logout,
        isAuthenticated,
        checkAuthStatus
    }
}