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
import Image from 'next/image';
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

            

            {/* Recent Sales Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-base font-medium text-gray-800">Recent Sales</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold For</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardSummaryData.recent_sales?.map((sale) => (
                                <tr key={sale.id}>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {new Date(sale.sale_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            {sale.shoe?.image_urls?.[0] && (
                                                <Image
                                                    src={sale.shoe.image_urls[0]}
                                                    alt={sale.shoe.model_name}
                                                    className="w-8 h-8 rounded object-cover"
                                                    width={32}
                                                    height={32}
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{sale.shoe_brand}</div>
                                                <div className="text-xs text-gray-500">{sale.shoe_model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{sale.shoe_category}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900"><span className='text-xs'>RWF</span> {sale.sold_for?.toLocaleString() || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{sale.quantity_sold}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">${parseInt(sale.unit_price).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">${parseInt(sale.total_amount).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{sale.notes}</td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-3 text-sm text-gray-500 text-center">
                                            No recent sales data available
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}