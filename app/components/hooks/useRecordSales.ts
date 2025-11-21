'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const itemSchema = z.object({
  size: z.string().min(1, 'Please select a size'),
  quantity: z.number()
    .min(1, 'Quantity must be at least 1')
    .max(1000, 'Quantity seems too high'),
  sold_for: z.number()
    .min(1, 'Price must be greater than 0')
    .max(10000000, 'Price seems too high')
});

const validationSchema = z.object({
  shoe_id: z.string().min(1, 'Shoe selection is required'),
  items_sold: z.array(itemSchema).min(1, 'Please add at least one item sold'),
});

export interface ItemSold {
  size: string;
  quantity: number;
  sold_for: number;
}

export interface RecordSalesFormData {
  shoe_id: string;
  items_sold: ItemSold[];
}

export const useRecordSales = (initialValues?: Partial<RecordSalesFormData>, onSuccess?: () => void) => {
  const [isRecordingSales, setIsRecordingSales] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecordSalesFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      shoe_id: initialValues?.shoe_id || '',
      items_sold: initialValues?.items_sold || [],
    }
  });

  const onSubmit = async (formData: RecordSalesFormData) => {
    setIsRecordingSales(true);
    try {
      const recordSalesUrl = getApiUrl(API_ENDPOINTS.SHOES.RECORD_SALES);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please sign in to record sales');
        router.push('/sign-in');
        return;
      }

      // Filter out incomplete items and validate quantities
      const validItems = formData.items_sold.filter(item =>
        item.size && item.quantity > 0 && item.sold_for > 0
      );

      if (validItems.length === 0) {
        toast.error('Please add at least one item with size, quantity, and price');
        return;
      }

      const response = await axios.post(recordSalesUrl, {
        ...formData,
        items_sold: validItems
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Sales recorded successfully!');
        reset();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboards/seller/all-shoes');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to record sales'
        : 'Failed to record sales';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsRecordingSales(false);
    }
  };

  return {
    onSubmit,
    isRecordingSales,
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    setValue
  };
};