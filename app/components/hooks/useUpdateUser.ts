import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError, setValidationErrors } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    subscriptionMonths: z.coerce.number().min(1, 'Subscription months is required'),
    subscriptionPayedOn: z.string().min(1, 'Subscription payed on is required'),
})

export interface UpdateUserFormData {
    subscriptionMonths: number;
    subscriptionPayedOn: string;
}

export const useUpdateUser = () => {
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const router = useRouter();
    const params = useParams();

const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
} = useForm<UpdateUserFormData>({
    resolver: zodResolver(validationSchema) as Resolver<UpdateUserFormData>,
    defaultValues: {
        subscriptionMonths: 0,
        subscriptionPayedOn: '',
    }
})



    const onSubmit = async (data: UpdateUserFormData) => {
        setIsUpdatingUser(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                router.push('/sign-in');
                return;
            }
            const response = await axios.put(getApiUrl(API_ENDPOINTS.USER.UPDATE(params.id as string)), data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success('Subscription updated successfully');
                reset();
            } else {
                toast.error('Failed to update subscription');
            }
        } catch (error) {
            handleApiError(error, {
                onValidationError: (errors) => setValidationErrors(errors, setError),
                onAuthFailure: () => {
                    localStorage.removeItem('token');
                    router.push('/sign-in');
                }
            });
        } finally {
            setIsUpdatingUser(false);
        }
    }

    return {
        register,
        handleSubmit,
        reset,
        errors,
        isSubmitting,
        onSubmit,
        isUpdatingUser,
    }
}