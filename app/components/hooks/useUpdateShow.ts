"use client"

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model_name: z.string().optional(),
    category: z.string().optional(),
    price_retail: z.string().min(1, 'Price retail is required'),
    description: z.string().optional(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    stockToAdd: z.string().optional(),
})

export interface UpdateShoeFormData {
    brand: string;
    model_name?: string;
    category?: string;
    price_retail: string;
    description?: string;
    colors?: string[];
    sizes?: string[];
    stockToAdd?: string;
    existingImages?: string[];
    imagesToDelete?: number[];
}

export default function useUpdateShow() {
    const [isUpdatingShoe, setIsUpdatingShoe] = useState(false);
    const router = useRouter();
    const params = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateShoeFormData>({
        resolver: zodResolver(validationSchema) as Resolver<UpdateShoeFormData>,
        defaultValues: {
            brand: '',
            model_name: '',
            category: '',
            price_retail: '',
            description: '',
            colors: [],
            sizes: [],
            stockToAdd: '',
            existingImages: [],
        }
    })

    const onSubmit = async (data: UpdateShoeFormData | FormData) => {
        setIsUpdatingShoe(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                router.push('/sign-in');
                return { success: false, error: 'Authentication required' };
            }

            // Get shoe ID from params
            const shoeId = params.id as string;
            if (!shoeId) {
                toast.error('Shoe ID is required');
                return { success: false, error: 'Shoe ID is required' };
            }

            const updateShoeUrl = getApiUrl(API_ENDPOINTS.SHOES.UPDATE(shoeId));

            // Determine headers based on data type
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
            };

            console.log('🔄 Updating shoe with ID:', shoeId);
            console.log('🔗 API Endpoint:', updateShoeUrl);

            const response = await axios.put(updateShoeUrl, data, {
                headers,
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success('Shoe updated successfully');
                reset();
                return { success: true, data: response.data };
            } else {
                toast.error('Failed to update shoe');
                return { success: false, error: 'Failed to update shoe' };
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update shoe'
                : 'Failed to update shoe';
            toast.error(`Error updating shoe: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            setIsUpdatingShoe(false);
        }
    }

    return {
        register,
        handleSubmit,
        reset,
        errors,
        isSubmitting,
        onSubmit,
        isUpdatingShoe,
    }
}