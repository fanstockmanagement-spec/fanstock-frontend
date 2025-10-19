'use client'

import { Loader, DollarSign, ShoppingCart, TrendingUp, Calendar, Clock, Package } from 'lucide-react';
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
import { Bar, Line } from 'react-chartjs-2';
import Image from 'next/image';

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
                                ${dashboardSummaryData.current_month?.revenue?.toLocaleString() || '0'}
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
                                ${dashboardSummaryData.current_year?.revenue?.toLocaleString() || '0'}
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

            {/* Transactions Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Month Transactions</p>
                            <p className="text-lg font-semibold text-indigo-600">
                                {dashboardSummaryData.current_month?.transactions || '0'}
                            </p>
                        </div>
                        <span className="text-indigo-500 bg-indigo-50 p-2 rounded-full">
                            <TrendingUp strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">This Year Transactions</p>
                            <p className="text-lg font-semibold text-teal-600">
                                {dashboardSummaryData.current_year?.transactions || '0'}
                            </p>
                        </div>
                        <span className="text-teal-500 bg-teal-50 p-2 rounded-full">
                            <Clock strokeWidth={1.5} size={16} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Comparison Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-medium text-gray-800">Revenue Comparison</h2>
                    </div>
                    <div className="p-6">
                        <Bar
                            data={{
                                labels: ['This Month', 'This Year'],
                                datasets: [
                                    {
                                        label: 'Revenue ($)',
                                        data: [
                                            dashboardSummaryData.current_month?.revenue || 0,
                                            dashboardSummaryData.current_year?.revenue || 0
                                        ],
                                        backgroundColor: [
                                            'rgba(34, 197, 94, 0.8)',
                                            'rgba(59, 130, 246, 0.8)'
                                        ],
                                        borderColor: [
                                            'rgba(34, 197, 94, 1)',
                                            'rgba(59, 130, 246, 1)'
                                        ],
                                        borderWidth: 2,
                                        borderRadius: 8,
                                        borderSkipped: false,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `Revenue: $${(context.parsed.y || 0).toLocaleString()}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function(value) {
                                                return '$' + value.toLocaleString();
                                            }
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                            height={300}
                        />
                    </div>
                </div>

                {/* Units Sold Line Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-medium text-gray-800">Units Sold Trend</h2>
                    </div>
                    <div className="p-6">
                        <Line
                            data={{
                                labels: ['This Month', 'This Year'],
                                datasets: [
                                    {
                                        label: 'Units Sold',
                                        data: [
                                            dashboardSummaryData.current_month?.units_sold || 0,
                                            dashboardSummaryData.current_year?.units_sold || 0
                                        ],
                                        borderColor: 'rgba(147, 51, 234, 1)',
                                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                                        borderWidth: 3,
                                        fill: true,
                                        tension: 0.4,
                                        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 2,
                                        pointRadius: 6,
                                        pointHoverRadius: 8,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `Units Sold: ${(context.parsed.y || 0).toLocaleString()}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function(value) {
                                                return value.toLocaleString();
                                            }
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                            height={300}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transactions Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-medium text-gray-800">Transactions Comparison</h2>
                    </div>
                    <div className="p-6">
                        <Bar
                            data={{
                                labels: ['This Month', 'This Year'],
                                datasets: [
                                    {
                                        label: 'Transactions',
                                        data: [
                                            dashboardSummaryData.current_month?.transactions || 0,
                                            dashboardSummaryData.current_year?.transactions || 0
                                        ],
                                        backgroundColor: [
                                            'rgba(99, 102, 241, 0.8)',
                                            'rgba(20, 184, 166, 0.8)'
                                        ],
                                        borderColor: [
                                            'rgba(99, 102, 241, 1)',
                                            'rgba(20, 184, 166, 1)'
                                        ],
                                        borderWidth: 2,
                                        borderRadius: 8,
                                        borderSkipped: false,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `Transactions: ${context.parsed.y}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                            height={300}
                        />
                    </div>
                </div>

                {/* Recent Sales Performance Line Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-medium text-gray-800">Recent Sales Performance</h2>
                    </div>
                    <div className="p-6">
                        <Line
                            data={{
                                labels: dashboardSummaryData.recent_sales?.map(sale => 
                                    new Date(sale.sale_date).toLocaleDateString()
                                ).reverse() || [],
                                datasets: [
                                    {
                                        label: 'Revenue ($)',
                                        data: dashboardSummaryData.recent_sales?.map(sale => 
                                            parseInt(sale.total_amount)
                                        ).reverse() || [],
                                        borderColor: 'rgba(249, 115, 22, 1)',
                                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                        borderWidth: 3,
                                        fill: true,
                                        tension: 0.4,
                                        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 2,
                                        pointRadius: 6,
                                        pointHoverRadius: 8,
                                    },
                                    {
                                        label: 'Units Sold',
                                        data: dashboardSummaryData.recent_sales?.map(sale => 
                                            sale.quantity_sold
                                        ).reverse() || [],
                                        borderColor: 'rgba(236, 72, 153, 1)',
                                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                        borderWidth: 3,
                                        fill: false,
                                        tension: 0.4,
                                        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 2,
                                        pointRadius: 6,
                                        pointHoverRadius: 8,
                                        yAxisID: 'y1',
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
                                        labels: {
                                            usePointStyle: true,
                                            padding: 20
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                if (context.datasetIndex === 0) {
                                                    return `Revenue: $${(context.parsed.y || 0).toLocaleString()}`;
                                                } else {
                                                    return `Units: ${context.parsed.y || 0}`;
                                                }
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        type: 'linear' as const,
                                        display: true,
                                        position: 'left' as const,
                                        ticks: {
                                            callback: function(value) {
                                                return '$' + value.toLocaleString();
                                            }
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    y1: {
                                        type: 'linear' as const,
                                        display: true,
                                        position: 'right' as const,
                                        grid: {
                                            drawOnChartArea: false,
                                        },
                                        ticks: {
                                            callback: function(value) {
                                                return value.toLocaleString();
                                            }
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                            height={300}
                        />
                    </div>
                </div>
            </div>

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