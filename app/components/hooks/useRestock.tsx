import { API_ENDPOINTS, getApiUrl } from '@/utils/env';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface RestockItem {
  size: string;
  quantity: number;
  restock_price: number;
}

export interface RestockFormData {
  shoe_id: string;
  user_id: number;
  items_restocked: RestockItem[];
}

interface RestockResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

// Validation schema
const restockSchema = yup.object().shape({
  shoe_id: yup.string().required('Shoe ID is required'),
  user_id: yup.number().required('User ID is required'),
  items_restocked: yup
    .array()
    .of(
      yup.object().shape({
        size: yup.string().required('Size is required'),
        quantity: yup
          .number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1')
          .integer('Quantity must be a whole number'),
        restock_price: yup
          .number()
          .required('Price is required')
          .min(0, 'Price cannot be negative'),
      })
    )
    .min(1, 'At least one item is required')
    .required('At least one item is required'),
});

export default function useRestock() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<RestockFormData>({
    resolver: yupResolver(restockSchema),
    defaultValues: {
      shoe_id: '',
      user_id: 1,
      items_restocked: [{ size: '', quantity: 1, restock_price: 0 }],
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  const onSubmit = async (data: RestockFormData): Promise<RestockResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        getApiUrl(API_ENDPOINTS.SHOES.RESTOCK(data.shoe_id)),
        {
          user_id: data.user_id,
          newStock: JSON.stringify(
            data.items_restocked.map(({ size, quantity }) => ({
              size,
              quantity,
            }))
          ),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const responseData = response.data;

      if (response.status !== 200) {
        throw new Error(responseData.error || 'Failed to restock item');
      }

      toast.success('Stock updated successfully');
      reset();
      return { success: true, message: 'Stock updated successfully', data: responseData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while restocking';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    handleSubmit,
    onSubmit,
    isLoading,
    error,
    reset,
    setValue,
  };
}