import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    isDisplayedMonthsPayed: z.coerce.number().min(1, 'Display months is required'),
    isDisplayedStartDate: z.string().min(1, 'Display start date is required'),
})

export interface UpdateDisplayStatusFormData {
    isDisplayedMonthsPayed: number;
    isDisplayedStartDate: string;
}

export const useUpdateDisplayStatus = () => {
    const [isUpdatingDisplayStatus, setIsUpdatingDisplayStatus] = useState(false);
    const params = useParams();

const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
} = useForm<UpdateDisplayStatusFormData>({
    resolver: zodResolver(validationSchema) as Resolver<UpdateDisplayStatusFormData>,
    defaultValues: {
        isDisplayedMonthsPayed: 0,
        isDisplayedStartDate: '',
    }
})



    const onSubmit = async (data: UpdateDisplayStatusFormData) => {
        setIsUpdatingDisplayStatus(true);
        try {
            setIsUpdatingDisplayStatus(true);
            const updateSubscriptionUrl = getApiUrl(API_ENDPOINTS.USER.UPDATE_DISPLAY_STATUS(params.id as string));
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No token found');
                return;
            }
            
            const response = await axios.put(updateSubscriptionUrl, data, { 
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success('Display status updated successfully');
                reset();
            } 
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update display status'
                : 'Failed to update display status';
            toast.error(`Error updating display status: ${errorMessage}`);
        } finally {
            setIsUpdatingDisplayStatus(false);
        }
    }

    return {
        register,
        handleSubmit,
        reset,
        errors,
        isSubmitting,
        onSubmit,
        isUpdatingDisplayStatus,
    }
}