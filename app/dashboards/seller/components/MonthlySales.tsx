'use client'

import { useState } from 'react';
import useMonthlySales from "@/app/components/hooks/useMontlySales";
import { Loader, DollarSign, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';

export default function MonthlySales() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    
    const { monthlySalesData, isLoadingMonthlySales, refetchMonthlySales } = useMonthlySales(selectedYear, selectedMonth);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        refetchMonthlySales(year, selectedMonth);
    };

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
        refetchMonthlySales(selectedYear, month);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
    ];

    return (
        <div className="p-6 text-sm">
            <h1 className="text-2xl font-medium mb-4">Monthly Sales Analytics</h1>
            
            {/* Year and Month Selectors */}
            <div className="mb-6 flex gap-4">
                <div>
                    <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                    </label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => handleYearChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                    </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => handleMonthChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoadingMonthlySales && (
                <div className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                    <p className="mt-2 text-gray-600">Loading monthly sales...</p>
                </div>
            )}

            {/* Analytics Dashboard */}
            {!isLoadingMonthlySales && monthlySalesData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-200 p-4 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Revenue</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        ${monthlySalesData.summary.total_revenue.toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-green-500 bg-green-50 p-2 rounded-full">
                                    <DollarSign strokeWidth={1.5} size={16}  />
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Units Sold</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {monthlySalesData.summary.total_units_sold.toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-blue-500 bg-blue-50 p-2 rounded-full">
                                    <ShoppingCart strokeWidth={1.5} size={16}  />
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Transactions</p>
                                    <p className="text-lg font-semibold text-purple-600">
                                        {monthlySalesData.summary.total_sales_transactions}
                                    </p>
                                </div>
                                <span className="text-purple-500 bg-purple-50 p-2 rounded-full">
                                    <TrendingUp strokeWidth={1.5} size={16}  />
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Avg Sale Value</p>
                                    <p className="text-lg font-semibold text-orange-600">
                                        ${monthlySalesData.summary.average_sale_value.toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-orange-500 bg-orange-50 p-2 rounded-full">
                                    <Calendar strokeWidth={1.5} size={16}  />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sales by Shoe Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-base font-medium text-gray-800">Sales by Shoe</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Count</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlySalesData.sales_by_shoe.map((shoe) => (
                                        <tr key={shoe.shoe_id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">{shoe.brand}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{shoe.model}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{shoe.category}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{shoe.quantity_sold}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">${shoe.revenue.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{shoe.sales_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-base font-medium text-gray-800">Daily Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Count</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlySalesData.daily_breakdown.map((day, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(day.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">${day.revenue.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{day.units_sold}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{day.sales_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sales by Category */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-base font-medium text-gray-800">Sales by Category</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(monthlySalesData.sales_by_category).map(([category, data]) => (
                                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                                        <p className="text-sm text-gray-600">Units: {data.quantity_sold}</p>
                                        <p className="text-sm text-gray-600">Revenue: ${data.revenue.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Data State */}
            {!isLoadingMonthlySales && !monthlySalesData && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No sales data found for {months[selectedMonth - 1]?.name} {selectedYear}</p>
                </div>
            )}
        </div>
    )
}