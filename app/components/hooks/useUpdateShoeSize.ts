"use client"

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    quantity: z.coerce.number().min(0, 'Quantity must be 0 or greater'),
    price: z.coerce.number().min(0, 'Price must be greater than 0'),
})

export interface UpdateShoeSizeFormData {
    quantity: number;
    price: number;
}

export const useUpdateShoeSize = () => {
    const [isUpdatingSize, setIsUpdatingSize] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateShoeSizeFormData>({
        resolver: zodResolver(validationSchema) as Resolver<UpdateShoeSizeFormData>,
        defaultValues: {
            quantity: 0,
            price: 0,
        }
    })

    const onSubmit = async (shoeId: string, size: string, data: UpdateShoeSizeFormData) => {
        setIsUpdatingSize(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return { success: false, error: 'Authentication required' };
            }

            const updateSizeUrl = getApiUrl(API_ENDPOINTS.SHOES.UPDATE_BY_SIZE(shoeId, size));

            console.log('🔄 Updating shoe size:', { shoeId, size, data });
            console.log('🔗 API Endpoint:', updateSizeUrl);

            const response = await axios.patch(updateSizeUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success('Size updated successfully');
                reset();
                return { success: true, data: response.data };
            } else {
                toast.error('Failed to update size');
                return { success: false, error: 'Failed to update size' };
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update size'
                : 'Failed to update size';
            toast.error(`Error updating size: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            setIsUpdatingSize(false);
        }
    }

    return {
        register,
        handleSubmit,
        reset,
        errors,
        isSubmitting,
        onSubmit,
        isUpdatingSize,
    }
}
