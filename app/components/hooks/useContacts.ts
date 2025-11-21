'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const validationSchema = z.object({
    yourName: z.string().min(1, 'Your name is required'),
    yourEmail: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    yourSubject: z.string().min(1, 'Subject is required'),
    yourMessage: z.string().min(1, 'Message is required'),
})

export type ContactFormData = z.infer<typeof validationSchema>;
interface Contact {
    id: number;
    yourName: string;
    yourEmail: string;
    yourSubject: string;
    yourMessage: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    read: boolean;
    contactStatus: string;
};

interface ApiError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}



export const useContacts = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            yourName: '',
            yourEmail: '',
            yourSubject: '',
            yourMessage: '',
        }
    })

    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const onSubmit = async (data: ContactFormData) => {
        setIsLoading(true);

        try {
            const contactsUrl = getApiUrl(API_ENDPOINTS.CONTACTS.CREATE);

            const response = await axios.post(contactsUrl, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            toast.success(response.data?.data?.message || response.data?.message || 'Your inquiry sent successfully');

            reset();
        } catch (error: unknown) {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    

    useEffect(() => {
        const getContacts = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const contactsUrl = getApiUrl(API_ENDPOINTS.CONTACTS.LIST);

            const response = await axios.get(contactsUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })


            // toast.success(response.data?.data?.message || response.data?.message || 'Contact Inquiries fetched successfully');
            setContacts(response.data?.data);
            reset();
        } catch (error: unknown) {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.message || 'Failed to fetch contacts');
        } finally {
            setIsLoading(false);
        }
    };

    getContacts();
    }, []);

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        isLoading,
        contacts,
        setContacts,
        formState: { errors },
    }
};