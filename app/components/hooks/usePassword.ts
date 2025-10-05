import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const validationSchema = z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
})

export type PasswordFormData = z.infer<typeof validationSchema>;

export const usePassword = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<PasswordFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: PasswordFormData) => {
        console.log(data);
        try {
            const response = await axios.post(getApiUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD), data);
            if (response.status === 200) {
                toast.success('Password reset email sent successfully');
            } else {
                toast.error('Failed to send password reset email');
            }
        } catch (error) {
            handleApiError(error, {
                onAuthFailure: () => {
                    localStorage.removeItem('token');
                }
            });
        }
    }

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        isSubmitting,
    }
}