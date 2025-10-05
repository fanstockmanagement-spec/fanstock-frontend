// Clean version of usePagination.ts
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const usePaginatedData = <T>(
    endpoint: string,
    initialParams: Record<string, unknown> = {}
) => {
    const [data, setData] = useState<T[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialParams.search || '');

    const fetchData = useCallback(async (page: number = 1, search?: string, filters: Record<string, unknown> = {}) => {
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                ...filters
            });

            // Add search parameter if provided
            if (search && search.trim()) {
                params.append('search', search.trim());
            }

            console.log('🔄 Fetching:', `${endpoint}?${params}`);

            const response = await axios.get(`${endpoint}?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('✅ API Response:', response.data);

            if (response.data?.success && response.data?.data) {
                setData(response.data.data.users || []);
                setPagination(response.data.data.pagination || pagination);
            }
        } catch (error) {
            console.error('❌ Error:', error);
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, pagination.limit, pagination]);

    const handleSearch = (search: string) => {
        console.log('🔍 Search:', search);
        setSearchTerm(search);
        fetchData(1, search);
    };

    const updateFilters = (newFilters: Record<string, unknown>) => {
        console.log('🔧 Filter:', newFilters);
        fetchData(1, searchTerm, newFilters);
    };

    const handlePageChange = (page: number) => {
        fetchData(page, searchTerm);
    };

    // Initial load
    useEffect(() => {
        fetchData(1, searchTerm);
    }, [fetchData, searchTerm]);

    return {
        data,
        pagination,
        isLoading,
        filters: { status: '' }, // Keep for compatibility
        searchTerm,
        fetchData,
        updateFilters,
        handleSearch,
        handlePageChange,
    };
};