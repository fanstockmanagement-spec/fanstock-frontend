'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError, setValidationErrors } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod"

const validationSchema = z.object({

    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive' | 'pending';
    role?: string;
}

export type CreateUserFormData = z.infer<typeof validationSchema>;


export const useUsers = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError,

    } = useForm<CreateUserFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
        }
    })

    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const onSubmit = async (data: CreateUserFormData) => {

        setIsLoading(true)
        try {
            const createUserUrl = getApiUrl(API_ENDPOINTS.USER.CREATE);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required. Please log in to create a seller.');
                setIsLoading(false)
                return
            }
            const response = await axios.post(createUserUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status >= 200 && response.status < 300) {
                toast.success('Seller created successfully')
                reset()
            } else {
                toast.error('Failed to create a seller')
            }

        } catch (error) {
            handleApiError(error, {
                onValidationError: (errors) => setValidationErrors(errors, setError),
                onAuthFailure: () => {
                    // Optionally redirect to login page here
                    console.log('Authentication failed, redirecting...');
                }
            });
        } finally {
            setIsLoading(false)
        }
    }


    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const usersUrl = getApiUrl(API_ENDPOINTS.USER.LIST);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required. Please log in to fetch users.');
                setIsLoading(false)
                return
            }
            const response = await axios.get(usersUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log("The response is", response.data)
            setUsers(response.data?.data?.users)


            if (response.status >= 200 && response.status < 300) {
                toast.success('Users fetched successfully')
            } else {
                toast.error('Failed to fetch users')
            }
        } catch (error) {
            handleApiError(error, {
                onAuthFailure: () => {
                    localStorage.removeItem('token');
                }
            });
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        onSubmit,
        isLoading,
        reset,
        setError,
        users
    }
}