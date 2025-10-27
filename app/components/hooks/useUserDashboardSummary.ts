'use client'

import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export interface DashboardSummaryData {
    current_month: {
        revenue: number;
        units_sold: number;
        transactions: number;
    };
    current_year: {
        revenue: number;
        units_sold: number;
        transactions: number;
    };
    recent_sales: Array<{
        id: number;
        sale_id: string | null;
        shoe_id: string;
        user_id: number;
        quantity_sold: number;
        sold_for: number;
        unit_price: string;
        total_amount: string;
        sale_date: string;
        shoe_brand: string;
        shoe_model: string;
        shoe_category: string;
        notes: string;
        createdAt: string;
        updatedAt: string;
        shoe: {
            shoe_id: string;
            brand: string;
            model_name: string;
            image_urls: string[];
        };
    }>;
};
export default function useUserDashboardSummary() {
    const [dashboardSummaryData, setDashboardSummaryData] = useState<DashboardSummaryData | null>(null);
    const [isLoadingUserDashboardSummary, setIsLoadingUserDashboardSummary] = useState(false);
    const router = useRouter();

    const getUserDashboardSummary = useCallback(async () => {
        setIsLoadingUserDashboardSummary(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required');
            setIsLoadingUserDashboardSummary(false);
            router.push('/sign-in');
            return;
        }
        try {
            const response = await axios.get(getApiUrl(API_ENDPOINTS.SALES_HISTORY.USER_DASHBOARD_SUMMARY),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.status >= 200 && response.status < 300) {
                setDashboardSummaryData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
          toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch sales history');
        } finally {
            setIsLoadingUserDashboardSummary(false);
        }
    }, [router]);

    useEffect(() => {
        getUserDashboardSummary();
    }, [getUserDashboardSummary]);
    return {
        dashboardSummaryData,
        isLoadingUserDashboardSummary,
    }
} 