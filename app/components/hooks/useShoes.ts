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
        formState: { errors, isSubmitting },
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
   const [shoes, setShoes] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isFetching, setIsFetching] = useState(false);
   
   const onSubmit = async (data: ShoesFormData | FormData) => {
    try {
        setIsLoading(true);
        const createShoesUrl = getApiUrl(API_ENDPOINTS.SHOES.CREATE);
        const token = localStorage.getItem('token');
        
        console.log('API URL:', createShoesUrl);
        console.log('Token exists:', !!token);
        console.log('Data type:', data instanceof FormData ? 'FormData' : 'JSON');
        
        // Endpoint exists, issue is with field names
        
        const headers: any = {
            'Authorization': `Bearer ${token}`
        };
        
        // Set Content-Type based on data type
        if (data instanceof FormData) {
            // Don't set Content-Type for FormData - let browser set it with boundary
        } else {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await axios.post(createShoesUrl, data, { headers });
        setShoes(response.data.data);
        toast.success('Shoes created successfully!');
        return response.data; // Return the response data for further handling
    } catch (error: any) {
        console.error('Error creating shoes:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        
        // Log the full error response for debugging
        if (error.response?.data) {
            console.error('Full error response:', error.response.data);
            console.error('Response headers:', error.response.headers);
            console.error('Response status:', error.response.status);
        }
        
        // Show more specific error messages
        const errorData = error.response?.data;
        if (errorData?.errors && Array.isArray(errorData.errors)) {
            toast.error(`Validation errors: ${errorData.errors.join(', ')}`);
        } else if (errorData?.message) {
            toast.error(errorData.message);
        } else if (errorData?.error) {
            toast.error(errorData.error);
        } else {
            toast.error('Failed to create shoes');
        }
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
    } catch (error: any) {
        console.error('Error fetching shoes:', error.response?.data || error.message);
        toast.error('Failed to fetch shoes');
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