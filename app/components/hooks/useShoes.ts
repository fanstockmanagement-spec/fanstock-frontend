"use client"

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod"

const validationSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model_name: z.string().min(1, 'Model is required'),
    category: z.string().min(1, 'Category is required'),
    stockin: z.string().min(1, 'Default price is required'),
    colors: z.array(z.string()).min(1, 'Colors are required'),
    sizes: z.array(z.string()).min(1, 'Sizes are required'),
    price_retail: z.string().min(1, 'Price retail is required'),
    description: z.string().min(1, 'Description is required'),
    images: z.array(z.string()).min(1, 'Images are required'),
})



export type ShoesFormData = z.infer<typeof validationSchema>;

export const useShoes = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ShoesFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            brand: '',
            model_name: '',
            category: '',
            stockin: '',
            colors: [],
            sizes: [],
            price_retail: '',
            description: '',
            images: [],
        }
    })
   const [shoes, setShoes] = useState<ShoesFormData[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isFetching, setIsFetching] = useState(false);
   
   const onSubmit = async (data: ShoesFormData | FormData) => {
    try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
        };
        
        const response = await axios.post(
            'https://fanstock-backend.onrender.com/api/v1/fanstock/create-shoe-stock',
            data,
            { headers }
        );
        
        toast.success('Shoes created successfully!');
        return { success: true, data: response.data };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch shoes'
                : 'Failed to create shoes';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setIsLoading(false);
    }
   }

   const getShoes = async () => {
    try {
        setIsFetching(true);
        const getShoesUrl = getApiUrl(API_ENDPOINTS.SHOES.LIST_USER_SHOES);
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No token found');
            return;
        }
        
        const response = await axios.get(getShoesUrl, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        console.log('Shoes fetched:', response.data);
        setShoes(response.data.data || []);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error && 'response' in error 
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch shoes'
            : 'Failed to fetch shoes';
        console.error('Error fetching shoes:', errorMessage);
        toast.error(errorMessage);
        setShoes([]);
    } finally {
        setIsFetching(false);
    }
   }



   useEffect(() => {
    getShoes();
   }, []);


   return {
    shoes,
    getShoes,
    register,
    handleSubmit,
    reset,
    errors,
    onSubmit,
    isSubmitting: isLoading,
    isFetching,
    watch,
   }
}