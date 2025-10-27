import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import axios from "axios";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface SalesHistory {
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
    },
    financial_details: {
        retail_price: number;
        actual_selling_price: number;
        cost_price: number;
        profit_per_unit: number;
        total_revenue: number;
        total_profit: number;
        profit_margin: number;
        markup_from_retail: number;
        markup_percentage: number;
    }
   
};
export default function useSalesHistory() {
    const [salesHistory, setSalesHistory] = useState<SalesHistory[]>([]);
    const [isLoadingSales, setIsLoadingSales] = useState(false);

    const getSalesHistory = async () => {
        setIsLoadingSales(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required');
            setIsLoadingSales(false);
            router.push('/sign-in');
            return;
        }
        try {
            const response = await axios.get(getApiUrl(API_ENDPOINTS.SALES_HISTORY.LIST),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.status >= 200 && response.status < 300) {
                setSalesHistory(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
          toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch sales history');
        } finally {
            setIsLoadingSales(false);
        }
    }

    useEffect(() => {
        getSalesHistory();
    }, []);
    return {
        salesHistory,
        isLoadingSales,
    }
} 