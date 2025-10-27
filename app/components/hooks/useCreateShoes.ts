"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import z from 'zod';
import { API_ENDPOINTS, getApiUrl } from '@/utils/env';

// (Removed duplicate interface. No replacement necessary.)


export interface Variant {
    size: string;
    color: string;
    quantity: string;
    price: string;
}

const variantSchema = z.object({
    size: z.string().min(1, 'Size is required'),
    color: z.string().min(1, 'Color is required'),
    quantity: z.string().min(1, 'Quantity is required'),
    price: z.string().min(1, 'Price is required'),
});

const validationSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model_name: z.string().min(1, 'Model is required'),
    category: z.string().min(1, 'Category is required'),
    price_retail: z.string().min(1, 'Retail price is required'),
    description: z.string().min(1, 'Description is required'),
    initial_stock: z.string().optional(),
    variants: z.array(variantSchema).min(1, 'At least one variant is required'),
});

export type CreateShoesFormData = z.infer<typeof validationSchema>;

export const useCreateShoes = () => {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        trigger,
        reset
    } = useForm<CreateShoesFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            brand: '',
            model_name: '',
            category: '',
            price_retail: '',
            description: '',
            initial_stock: '',
            variants: [{ size: '', color: '', quantity: '', price: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants'
    });

    // Constants
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB per file
    const MAX_IMAGES = 5; // Maximum number of images
    const MAX_WIDTH = 800; // Maximum width for compression
    const QUALITY = 0.8; // Compression quality

    // Image compression function
    const compressImage = (file: File, maxWidth = MAX_WIDTH, quality = QUALITY): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }
                }, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) return;
        
        if (images.length + files.length > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed`);
            return;
        }
        
        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE * 2);
        if (oversizedFiles.length > 0) {
            toast.error(`Some files are too large. Maximum size is ${(MAX_FILE_SIZE * 2) / (1024 * 1024)}MB before compression`);
            return;
        }
        
        try {
            const compressedFiles = await Promise.all(
                files.map(file => compressImage(file))
            );
            
            const stillOversized = compressedFiles.filter(file => file.size > MAX_FILE_SIZE);
            if (stillOversized.length > 0) {
                toast.error(`Some files are still too large after compression. Please try smaller images.`);
                return;
            }
            
            setImages(prev => [...prev, ...compressedFiles]);
            toast.success(`${compressedFiles.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Error compressing images:', error);
            toast.error('Error processing images. Please try again.');
        }
        
        e.target.value = '';
    };

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Step validation
    const validateStep1 = async () => {
        const isValid = await trigger(['brand', 'model_name', 'category', 'price_retail', 'description']);
        
        if (!isValid) {
            toast.error('Please fill in all required fields');
            return false;
        }
        
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return false;
        }
        
        const oversizedImages = images.filter(img => img.size > MAX_FILE_SIZE);
        if (oversizedImages.length > 0) {
            toast.error('Some images are still too large. Please remove them and try again.');
            return false;
        }
        
        return true;
    };

    // Navigation handlers
    const handleNext = async () => {
        if (!(await validateStep1())) return;
        setStep(2);
    };

    const handleBack = () => setStep(1);
    const handleCancel = () => router.back();

    // Variant handlers
    const addVariant = () => {
        const defaultPrice = watch('price_retail') || '';
        append({ size: '', color: '', quantity: '', price: defaultPrice });
    };

    const removeVariant = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    // Variant validation
    const validateVariants = (variants: CreateShoesFormData['variants']) => {
        for (const variant of variants) {
            const size = parseInt(variant.size);
            const quantity = parseInt(variant.quantity);
            const price = parseFloat(variant.price);

            if (size < 35 || size > 60) {
                toast.error('Shoe size must be between 35 and 60');
                return false;
            }

            if (quantity > 1000) {
                toast.error('Quantity cannot exceed 1000');
                return false;
            }

            if (price > 10000000) {
                toast.error('Price cannot exceed 10,000,000 RWF');
                return false;
            }
        }
        
        return true;
    };

    // Form submission
    const onSubmit = async (data: CreateShoesFormData) => {
        if (!validateVariants(data.variants)) return;

        const colors = [...new Set(data.variants.map(v => v.color).filter(Boolean))];
        const sizes = [...new Set(data.variants.map(v => v.size).filter(Boolean))];
        const stockIn = data.variants.reduce((sum, v) => sum + (parseInt(v.quantity) || 0), 0);

        const formData = new FormData();
        
        formData.append('brand', data.brand);
        formData.append('model_name', data.model_name);
        formData.append('category', data.category);
        formData.append('stockIn', stockIn.toString());
        formData.append('price_retail', data.price_retail);
        formData.append('description', data.description);
        formData.append('colors', JSON.stringify(colors));
        formData.append('sizes', JSON.stringify(sizes));
        
        images.forEach(image => {
            formData.append('imageUrls', image);
        });

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            
            const response = await axios.post(getApiUrl(API_ENDPOINTS.SHOES.CREATE), formData, { headers });
            
            toast.success('Shoes created successfully!');
            
            // Reset form on success
            reset({
                brand: '',
                model_name: '',
                category: '',
                price_retail: '',
                description: '',
                initial_stock: '',
                variants: [{ size: '', color: '', quantity: '', price: '' }]
            });
            setImages([]);
            setStep(1);
            
            return { success: true, data: response.data };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create shoes'
                : 'Failed to create shoes';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Form state
        step,
        images,
        isSubmitting,
        
        // Form methods
        register,
        handleSubmit: handleSubmit(onSubmit),
        watch,
        control,
        errors,
        
        // Field array methods
        fields,
        addVariant,
        removeVariant,
        
        // Image methods
        handleImageUpload,
        removeImage,
        
        // Navigation methods
        handleNext,
        handleBack,
        handleCancel,
        
        // Constants
        MAX_FILE_SIZE,
        MAX_IMAGES,
    };
};