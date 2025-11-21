"use client";

import { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, getApiUrl } from '@/utils/env';
import * as yup from 'yup';

// Types
export interface SizeInventory {
  size: string;
  quantity: number;
  price: number;
}

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 5;
const MAX_WIDTH = 800;
const QUALITY = 0.8;

const validationSchema = yup.object().shape({
  brand: yup.string().required('Brand is required'),
  size_inventory: yup
    .array()
    .of(
      yup.object().shape({
        size: yup.string().required('Size is required'),
        quantity: yup.number().required('Quantity is required').min(1, 'Minimum quantity is 1'),
        price: yup.number().required('Price is required').min(0, 'Price must be positive'),
      })
    )
    .min(1, 'At least one size variant is required')
    .required('At least one size variant is required'),
  imageUrls: yup
    .array()
    .of(yup.mixed<File>())
    .min(1, 'At least one image is required')
    .required('Images are required'),
});

type CreateShoesFormValues = yup.InferType<typeof validationSchema>;

// Image compression utility
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

export const useCreateShoes = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors }, 
    reset,
    setValue,
  } = useForm<CreateShoesFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      brand: '',
      size_inventory: [{ size: '', quantity: 1, price: 0 }],
      imageUrls: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'size_inventory',
  });

  // Sync images with form state
  useEffect(() => {
    setValue('imageUrls', images);
  }, [images, setValue]);

  // Image handlers
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
        toast.error('Some files are still too large after compression. Please try smaller images.');
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

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Size inventory handlers
  const addVariant = () => append({ size: '', quantity: 1, price: 0 });
  const removeVariant = (index: number) => fields.length > 1 && remove(index);

  // Validation
  const validateSizeInventory = useCallback((sizeInventory: SizeInventory[]) => {
    for (const item of sizeInventory) {
      const size = parseInt(item.size);
      
      if (size < 35 || size > 60) {
        toast.error('Shoe size must be between 35 and 60');
        return false;
      }

      if (item.quantity > 1000) {
        toast.error('Quantity cannot exceed 1000');
        return false;
      }

      if (item.price > 10000000) {
        toast.error('Price cannot exceed 10,000,000 RWF');
        return false;
      }
    }
    
    return true;
  }, []);

  // Form submission
  const onSubmit = async (data: CreateShoesFormValues) => {
    if (!validateSizeInventory(data.size_inventory)) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('brand', data.brand);
      formData.append('size_inventory', JSON.stringify(data.size_inventory));
      images.forEach(image => formData.append('imageUrls', image));

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        getApiUrl(API_ENDPOINTS.SHOES.CREATE),
        formData,
        { headers }
      );

      toast.success(response.data?.data?.message || 'Shoes created successfully');

      // Reset form
      reset({
        brand: '',
        size_inventory: [{ size: '', quantity: 1, price: 0 }],
        imageUrls: [],
      });
      setImages([]);

      return { success: true, data: response.data };
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Failed to create shoes'
        : 'Failed to create shoes';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    images,
    isSubmitting,
    
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit), // Pre-bound version
    control,
    errors,
    
    // Field array methods
    fields,
    addVariant,
    removeVariant,
    
    // Image methods
    handleImageUpload,
    removeImage,
    
    // Constants
    MAX_FILE_SIZE,
    MAX_IMAGES,
  };
};