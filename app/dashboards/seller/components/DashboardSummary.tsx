'use client'

import { Loader, DollarSign, ShoppingCart, Calendar, Package } from 'lucide-react';
import useUserDashboardSummary from "@/app/components/hooks/useUserDashboardSummary";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import MonthlyBreakDownChart from './AnalyticsCharts/MonthlyBreakDownChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function DashboardSummary() {
    const { dashboardSummaryData, isLoadingUserDashboardSummary } = useUserDashboardSummary();

    if (isLoadingUserDashboardSummary) {
        return (
            <div className="text-center py-8">
                <Loader className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                <p className="mt-2 text-gray-600">Loading dashboard summary...</p>
            </div>
        );
    }

    if (!dashboardSummaryData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No dashboard data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-10">

            {/* Current Month vs Year Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current Month Revenue */}
                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Month Revenue</p>
                            <p className="text-lg font-semibold text-green-600">
                                <span className='text-xs'>RWF</span> {dashboardSummaryData.current_month?.revenue?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <span className="text-green-500 bg-green-50 p-2 rounded-full">
                            <DollarSign strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>

                {/* Current Year Revenue */}
                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Year Revenue</p>
                            <p className="text-lg font-semibold text-blue-600">
                                <span className='text-xs'>RWF</span> {dashboardSummaryData.current_year?.revenue?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <span className="text-blue-500 bg-blue-50 p-2 rounded-full">
                            <Calendar strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>

                {/* Current Month Units */}
                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Month Units</p>
                            <p className="text-lg font-semibold text-purple-600">
                                {dashboardSummaryData.current_month?.units_sold?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <span className="text-purple-500 bg-purple-50 p-2 rounded-full">
                            <Package strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>

                {/* Current Year Units */}
                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Year Units</p>
                            <p className="text-lg font-semibold text-orange-600">
                                {dashboardSummaryData.current_year?.units_sold?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <span className="text-orange-500 bg-orange-50 p-2 rounded-full">
                            <ShoppingCart strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>
            </div>

            <MonthlyBreakDownChart />
        </div>
    );
}