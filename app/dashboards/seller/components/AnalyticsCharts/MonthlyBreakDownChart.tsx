import { useState } from 'react';
import useAnnualSales from "@/app/components/hooks/useAnnualSales";
import { PluginOptionsByType, TooltipItem, TooltipOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

export default function MonthlyBreakDownChart() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const { annualSalesData } = useAnnualSales(selectedYear);
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profit' | 'units'>('revenue');

    // Generate year options (current year and 4 years back)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Filter and prepare data based on selections
    const monthlyData = annualSalesData?.monthly_breakdown || [];

    // Calculate profit for each month (revenue - cost)
    // Note: Since cost isn't in the data, we'll calculate profit as revenue - (units_sold * average_cost)
    // You may need to adjust this calculation based on your actual business logic
    const calculateProfit = (month: string) => {
        const averageCostPerUnit = 1000; // Adjust this based on your actual cost structure
        return month.revenue - (month.units_sold * averageCostPerUnit);
    };

    const calculateProfitMargin = (month: string) => {
        if (month.revenue === 0) return 0;
        const profit = calculateProfit(month);
        return (profit / month.revenue) * 100;
    };

    const getDatasets = () => {
        const baseConfig = {
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
        };

        switch (selectedMetric) {
            case 'revenue':
                return [
                    {
                        label: 'Revenue',
                        data: monthlyData.map(month => month.revenue),
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        ...baseConfig,
                    },
                    {
                        label: 'Units Sold',
                        data: monthlyData.map(month => month.units_sold),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)',
                        borderColor: 'rgb(249, 115, 22)',
                        yAxisID: 'y1',
                        ...baseConfig,
                    }
                ];
            case 'profit':
                return [
                    {
                        label: 'Profit',
                        data: monthlyData.map(month => calculateProfit(month)),
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: 'rgb(34, 197, 94)',
                        ...baseConfig,
                    },
                    {
                        label: 'Profit Margin (%)',
                        data: monthlyData.map(month => calculateProfitMargin(month)),
                        backgroundColor: 'rgba(168, 85, 247, 0.8)',
                        borderColor: 'rgb(168, 85, 247)',
                        yAxisID: 'y1',
                        ...baseConfig,
                    }
                ];
            case 'units':
                return [
                    {
                        label: 'Units Sold',
                        data: monthlyData.map(month => month.units_sold),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)',
                        borderColor: 'rgb(249, 115, 22)',
                        ...baseConfig,
                    },
                    {
                        label: 'Sales Count',
                        data: monthlyData.map(month => month.sales_count),
                        backgroundColor: 'rgba(236, 72, 153, 0.8)',
                        borderColor: 'rgb(236, 72, 153)',
                        yAxisID: 'y1',
                        ...baseConfig,
                    }
                ];
            default:
                return [];
        }
    };

    const formatValue = (value: number, datasetIndex: number) => {
        if (selectedMetric === 'revenue') {
            return datasetIndex === 0
                ? `RWF ${value.toLocaleString()}`
                : `${value.toLocaleString()} units`;
        } else if (selectedMetric === 'profit') {
            return datasetIndex === 0
                ? `RWF ${value.toLocaleString()}`
                : `${value.toFixed(1)}%`;
        } else if (selectedMetric === 'units') {
            return datasetIndex === 0
                ? `${value.toLocaleString()} units`
                : `${value} sales`;
        }
        return value.toLocaleString();
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 13,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                callbacks: {
                    label: function (context: TooltipItem<"bar"> & { datasetIndex: number }) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: ${formatValue(value, context.datasetIndex)}`;
                    }
                }
            } as TooltipOptions<"bar">
        } as unknown as PluginOptionsByType<"bar">,
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        if (selectedMetric === 'revenue' || selectedMetric === 'profit') {
                            return 'RWF ' + Number(value).toLocaleString();
                        }
                        return Number(value).toLocaleString();
                    },
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value) {
                        if (selectedMetric === 'profit') {
                            return Number(value).toFixed(1) + '%';
                        }
                        return Number(value).toLocaleString();
                    },
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    return (
        <div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-clip">
                <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-base font-medium text-gray-800">Monthly Breakdown</h2>

                    <div className="flex items-center gap-3">
                        {/* Metric Selector */}
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value as 'revenue' | 'profit' | 'units')}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="revenue">Revenue & Units</option>
                            <option value="profit">Profit & Margin</option>
                            <option value="units">Units & Sales</option>
                        </select>

                        {/* Year Filter */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>


                    </div>
                </div>

                <div className="p-6">
                    {monthlyData.length > 0 ? (
                        <Bar
                            data={{
                                labels: monthlyData.map(month => month.month_name),
                                datasets: getDatasets()
                            }}
                            options={chartOptions}
                            height={320}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-80 text-gray-500">
                            <p>No data available for {selectedYear}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}