import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export interface AnnualSalesData {
    period: {
        year: number;
        month: number;
        month_name: string;
    };
    summary: {
        total_revenue: number;
        total_units_sold: number;
        total_sales_transactions: number;
        average_sale_value: number;
    };
    sales_by_shoe: Array<{
        shoe_id: string;
        brand: string;
        model: string;
        category: string;
        quantity_sold: number;
        revenue: number;
        sales_count: number;
    }>;
    sales_by_category: Record<string, {
        quantity_sold: number;
        revenue: number;
    }>;
    daily_breakdown: Array<{
        date: string;
        revenue: number;
        units_sold: number;
        sales_count: number;
    }>;
};
export default function useAnnualSales(year?: number) {
    const [annualSalesData, setAnnualSalesData] = useState<AnnualSalesData | null>(null);
    const [isLoadingAnnualSales, setIsLoadingAnnualSales] = useState(false);
    const router = useRouter();
    const getAnnualSales = useCallback(async (yearParam?: number) => {
        setIsLoadingAnnualSales(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required');
            setIsLoadingAnnualSales(false);
            router.push('/sign-in');
            return;
        }

        // Use current year and month if not provided
        const currentYear = yearParam || year || new Date().getFullYear();

        try {
            const response = await axios.get(getApiUrl(API_ENDPOINTS.SALES_HISTORY.ANNUAL_SALES),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        year: currentYear,
                    }
                }
            )
            if (response.status >= 200 && response.status < 300) {
                setAnnualSalesData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
          toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch annual sales');
        } finally {
            setIsLoadingAnnualSales(false);
        }
    }, [year, router]);

    useEffect(() => {
        getAnnualSales();
    }, [getAnnualSales]);
    
    return {
        annualSalesData,
        isLoadingAnnualSales,
        refetchAnnualSales: getAnnualSales,
    }
} 