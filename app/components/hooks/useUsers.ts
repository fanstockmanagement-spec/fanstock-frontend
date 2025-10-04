'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

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

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseUsersOptions {
  search?: string;
  status?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = options;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) params.append('search', search);
      if (status) params.append('status', status);

      // For now, we'll assume there's a GET endpoint for users
      // You may need to adjust this endpoint based on your API
      const usersUrl = getApiUrl('/users'); // You might need to add this to API_ENDPOINTS
      const response = await axios.get(`${usersUrl}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        const data: UsersResponse = response.data;
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      handleApiError(error, {
        onAuthFailure: () => {
          localStorage.removeItem('token');
          // Optionally redirect to login
        }
      });
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, sortBy, sortOrder, page, limit]);

  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    total,
    totalPages,
    currentPage: page,
    refreshUsers
  };
};
