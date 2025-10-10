'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    shoe_id: z.string().min(1, 'Shoe ID is required'),
    quantity_sold: z.number().min(1, 'Quantity is required'),
    notes: z.string().min(1, 'Notes are required'),
})

export interface RecordSalesFormData {
    shoe_id: string;
    quantity_sold: number;
    notes: string;
}

export const useRecordSales = (initialValues?: Partial<RecordSalesFormData>, onSuccess?: () => void) => {
    const [isRecordingSales, setIsRecordingSales] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RecordSalesFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            shoe_id: initialValues?.shoe_id || '',
            quantity_sold: initialValues?.quantity_sold || 0,
            notes: initialValues?.notes || '',
        }
    })

    const onSubmit = async (data: RecordSalesFormData) => {
        setIsRecordingSales(true);
        try {
            const recordSalesUrl = getApiUrl(API_ENDPOINTS.SHOES.RECORD_SALES);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                router.push('/sign-in');
                return;
            }
            const response = await axios.post(recordSalesUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success('Sales recorded successfully');
                reset();
            }

           
            
            // Call success callback if provided (e.g., to close modal)
            if (onSuccess) {
                onSuccess();
            } else {
                // Default behavior: redirect to all-shoes page
                router.push('/dashboards/seller/all-shoes');
            }
            
        }
         catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to record sales'
                : 'Failed to record sales';
            toast.error(`Error recording sales: ${errorMessage}`);
        } finally {
            setIsRecordingSales(false);
        }
    }


    return {
        onSubmit,
        isRecordingSales,
        register,
        handleSubmit,
        reset,
        errors,
        isSubmitting,
    }
}