'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        try {
            const forgotPasswordUrl = getApiUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD);
            
            const response = await axios.post(forgotPasswordUrl, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                // Use backend success message if available, fallback to generic message
                const successMessage = response.data?.message || 
                                     response.data?.data?.message || 
                                     'Password reset email sent successfully';
                toast.success(successMessage);
                reset();
            } else {
                // Use backend error message if available
                const errorMessage = response.data?.message || 
                                   response.data?.error || 
                                   response.data?.data?.message ||
                                   'Failed to send password reset email';
                toast.error(errorMessage);
            }

        } catch (error) {
            handleApiError(error, {
                onAuthFailure: () => {
                    // Forgot password doesn't require authentication
                },
                fallbackMessage: 'Unable to send password reset email. Please try again.'
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
        isLoading,
        onSubmit,
        reset,
    };
};
