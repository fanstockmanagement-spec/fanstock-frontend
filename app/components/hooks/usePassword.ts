'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const usePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);

        try {
            const changePasswordUrl = getApiUrl(API_ENDPOINTS.USER.CHANGE_PASSWORD);
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error('Authentication required. Please log in to change your password.');
                return;
            }

            const response = await axios.post(changePasswordUrl, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                // Use backend success message if available, fallback to generic message
                const successMessage = response.data?.message || 
                                     response.data?.data?.message || 
                                     'Password changed successfully';
                toast.success(successMessage);
                reset();
            } else {
                // Use backend error message if available
                const errorMessage = response.data?.message || 
                                   response.data?.error || 
                                   response.data?.data?.message ||
                                   'Failed to change password';
                toast.error(errorMessage);
            }

        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        isLoading,
        onSubmit,
        reset,
    };
};