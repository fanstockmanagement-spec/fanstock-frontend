import { API_ENDPOINTS, getApiUrl } from "@/utils/env";
import axios from "axios";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface SalesHistory         {
            "sale_id": number,
            "shoe_id": string,
            "shoe_brand": string,
            "shoe_image": string,
            "items_sold": [
                {
                    "size": string,
                    "quantity": number,
                    "sold_for": number,
                    "item_total": number,
                    "retail_price": number,
                    "used_retail_price": boolean
                }
            ],
            "total_quantity": number,
            "total_amount": number,
            "sale_date": string,
            "notes": string
        }
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