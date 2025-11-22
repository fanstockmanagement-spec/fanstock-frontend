import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS, getApiUrl } from '@/utils/env';

export interface RestockItem {
  size: string;
  quantity: number;
  restock_price: number;
}

export interface RestockFormData {
  shoe_id: string;
  user_id: string;
  newStock: RestockItem[]; // Changed from items_restocked to newStock
}

export default function useRestock() {
  const [isLoading, setIsLoading] = useState(false);

  // Get user ID from localStorage
  const getUserId = (): string => {
    if (typeof window === 'undefined') return '';
    
    try {
      // Try to get from user object in localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.userId || user._id || '';
      }
      
      // Try to get from auth token or other storage key
      const token = localStorage.getItem('token');
      if (token) {
        // If you store user ID in a separate key
        const userId = localStorage.getItem('userId');
        return userId || '';
      }
      
      return '';
    } catch (error) {
      console.error('Error getting user ID from localStorage:', error);
      return '';
    }
  };

  const methods = useForm<RestockFormData>({
    defaultValues: {
      shoe_id: '',
      user_id: getUserId(),
      newStock: [{ size: '', quantity: 1, restock_price: 0 }] // Updated to newStock
    }
  });

  const onSubmit = async (data: RestockFormData) => {
    setIsLoading(true);
    
    try {
      // Ensure we have the latest user ID from localStorage
      const currentUserId = getUserId();
      if (!currentUserId) {
        toast.error('User not authenticated. Please log in again.');
        return { success: false, error: 'User not authenticated' };
      }

      const formData = {
        ...data,
        user_id: currentUserId
      };

      console.log('📦 PAYLOAD BEING SENT:', JSON.stringify(formData, null, 2));
      console.log('🔗 API ENDPOINT:', getApiUrl(API_ENDPOINTS.SHOES.RESTOCK(formData.shoe_id)));
      
      const response = await axios.post(
        getApiUrl(API_ENDPOINTS.SHOES.RESTOCK(formData.shoe_id)), 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      toast.success('Inventory restocked successfully!');
      return { success: true, data: response.data };
      window.location.reload();
    } catch (error: any) {
      console.error('Restock error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to restock inventory';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    onSubmit,
    isLoading,
    handleSubmit: methods.handleSubmit,
    setValue: methods.setValue,
    register: methods.register,
    getUserId
  };
}