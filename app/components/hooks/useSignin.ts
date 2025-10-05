'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env"
import { handleApiError } from "@/utils/errorHandler"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const validationSchema = z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
})

export type SignInFormData = z.infer<typeof validationSchema>;



export const useSignin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignInFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);

        try {
            const signInUrl = getApiUrl(API_ENDPOINTS.AUTH.SIGNIN);

            const response = await axios.post(signInUrl, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Check if response exists and has successful status
            if (response.status === 200) {
                const responseData = response.data;

                // Handle different possible response structures
                if (responseData.success === true || responseData.status === 'success') {
                    const { user, token, role } = responseData.data || responseData;

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('role', role);

                    toast.success(`Welcome back, ${user.name || user.email}`)

                    // Redirect based on success, ignore role for now
                    if (user.userType === 'admin') {
                        router.push('/dashboards/system-admin');
                    } else if (user.userType === 'seller') {
                        router.push('/dashboards/seller');
                    } else if (user.userType === undefined) {
                        router.push('/subscription-info');
                    }
                    reset();
                } else {
                    // Handle unsuccessful response
                    toast.error(responseData.message || 'Login failed');
                }
            }
        } catch (error) {
            handleApiError(error, {
                onAuthFailure: () => {
                    localStorage.removeItem('token');
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        onSubmit,
        isLoading,
    }
};