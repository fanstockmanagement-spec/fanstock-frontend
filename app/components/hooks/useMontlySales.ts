import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export interface MonthlySalesData {
    period: {
        year: number;
        month: number;
        month_name: string;
    };
    summary: {
        total_revenue: number;
        total_units_sold: number;
        total_transactions: number;
        average_sale_value: number;
    };
    sales_by_brand: Array<{
        brand: string;
        quantity_sold: number;
        revenue: number;
        sales_count: number;
    }>;
    sales_by_category: Record<string, {
        quantity_sold: number;
        revenue: number;
    }>;
    stock_value_remaining: number;
    daily_breakdown: Array<{
        date: string;
        revenue: number;
        units_sold: number;
        sales_count: number;
    }>;
};
export default function useMonthlySales(year?: number, month?: number) {
    const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData | null>(null);
    const [isLoadingMonthlySales, setIsLoadingMonthlySales] = useState(false);
    const router = useRouter();
    const getMonthlySales = useCallback(async (yearParam?: number, monthParam?: number) => {
        setIsLoadingMonthlySales(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required');
            setIsLoadingMonthlySales(false);
            router.push('/sign-in');
            return;
        }

        // Use current year and month if not provided
        const currentYear = yearParam || year || new Date().getFullYear();
        const currentMonth = monthParam || month || new Date().getMonth() + 1;

        try {
            const response = await axios.get(getApiUrl(API_ENDPOINTS.SALES_HISTORY.MONTHLY_SALES),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        year: currentYear,
                        month: currentMonth
                    }
                }
            )
            if (response.status >= 200 && response.status < 300) {
                setMonthlySalesData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
          toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch monthly sales');
        } finally {
            setIsLoadingMonthlySales(false);
        }
    }, [year, month, router]);

    useEffect(() => {
        getMonthlySales();
    }, [getMonthlySales]);
    
    return {
        monthlySalesData,
        isLoadingMonthlySales,
        refetchMonthlySales: getMonthlySales,
    }
} 