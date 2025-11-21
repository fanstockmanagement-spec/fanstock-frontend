'use client'

import { usePaginatedData } from '@/app/components/hooks/usePagination';
import useSalesHistory, { SalesHistory } from '@/app/components/hooks/useSalesHistory';

import { getApiUrl, API_ENDPOINTS } from '@/utils/env';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function SellersTable() {
    const { salesHistory } = useSalesHistory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<SalesHistory | null>(null);

    // Format number with commas
    const formatNumber = (num: string | number) => {
        return Number(num).toLocaleString();
    };

    // Handle row click to open modal
    const handleRowClick = (sale: SalesHistory) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSale(null);
    };

    const {
        pagination,
        isLoading,
        handlePageChange,
        searchTerm,
        handleSearch
    } = usePaginatedData<SalesHistory>(
        getApiUrl(API_ENDPOINTS.SALES_HISTORY.LIST),
        {
            search: ''
        }
    );

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const { page, totalPages } = pagination;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...', totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, '...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-5 text-xs w-full mb-5">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
                        <p className="text-xs text-gray-500">View and manage your sales history</p>
                    </div>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                            Loading...
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 w-full">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand or shoe ID..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-[250px] pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shoe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sizes Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {salesHistory.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No sales history found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            salesHistory.map((sale) => (
                                <tr key={sale.sale_id} className="hover:bg-gray-50 transition-colors text-xs cursor-pointer" onClick={() => handleRowClick(sale)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-orange-500 rounded-full overflow-clip flex items-center justify-center text-white font-medium text-sm">
                                                <Image
                                                    src={sale.shoe?.image_urls?.[0] || ''}
                                                    alt={sale.shoe_brand || ''}
                                                    className="object-cover w-full h-full"
                                                    width={40}
                                                    height={40}
                                                />                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{sale.shoe_brand}</div>
                                                <div className="text-gray-500 text-xs">ID: {sale.shoe_id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            <span className="bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full px-2 py-1 whitespace-nowrap">
                                                {sale.quantity_sold} item{sale.quantity_sold !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 font-medium">
                                        {sale.quantity_sold}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 font-semibold">
                                        {formatNumber(sale.total_amount)} RWF
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                        {new Date(sale.sale_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                        {new Date(sale.sale_date).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px]">
                                        <p className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {sale.notes || '-'}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Footer with Pagination */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 w-full">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <span>
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} results
                        </span>
                        {isLoading && (
                            <div className="flex items-center gap-1">
                                <div className="animate-spin h-3 w-3 border border-orange-500 border-t-transparent rounded-full"></div>
                                <span>Loading...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || isLoading}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {generatePageNumbers().map((pageNum, index) => (
                                <span key={index}>
                                    {pageNum === '...' ? (
                                        <span className="px-2 py-1">...</span>
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(Number(pageNum))}
                                            disabled={isLoading}
                                            className={`px-3 py-1 rounded transition-colors disabled:cursor-not-allowed ${pagination.page === pageNum
                                                ? 'bg-orange-500 text-white'
                                                : 'hover:bg-gray-200'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages || isLoading}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedSale && (
                <SingleSaleHistoryModal
                    sale={selectedSale}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    formatNumber={formatNumber}
                />
            )}
        </div>
    );
}

interface SingleSaleHistoryModalProps {
    sale: SalesHistory;
    isOpen: boolean;
    onClose: () => void;
    formatNumber: (num: string | number) => string;
}

export function SingleSaleHistoryModal({ sale, isOpen, onClose, formatNumber }: SingleSaleHistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors duration-150 z-10"
                >
                    <X strokeWidth={1.5} size={16} />
                </button>

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Sale Details</h2>
                    <p className="text-xs text-gray-500 mt-1">Sale ID: {sale.sale_id}</p>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-4 space-y-6">
                    {/* Shoe Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Shoe Information</h3>
                        <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 bg-orange-500 rounded-full overflow-clip flex items-center justify-center text-white font-medium text-sm">
                                {sale.shoe.image_urls?.length > 0 ? (
                                    <Image
                                        src={sale.shoe.image_urls[0]}
                                        alt={sale.shoe_brand || ''}
                                        className="object-cover w-full h-full"
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <span>{sale.shoe_brand?.charAt(0) || 'N/A'}</span>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="text-base font-semibold text-gray-900">{sale.shoe_brand}</div>
                                <div className="text-xs text-gray-500">Shoe ID: {sale.shoe_id}</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Sold Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Sale Details</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Quantity Sold</label>
                                        <p className="text-sm font-semibold text-gray-900">{sale.quantity_sold}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Unit Price</label>
                                        <p className="text-sm font-semibold text-gray-900">{formatNumber(sale.unit_price)} RWF</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Sold For</label>
                                        <p className="text-sm font-semibold text-gray-900">{formatNumber(sale.sold_for)} RWF</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Total Amount</label>
                                        <p className="text-sm font-semibold text-orange-600">{formatNumber(sale.total_amount)} RWF</p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Retail Price: {formatNumber(sale.unit_price)} RWF</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sale Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <label className="text-xs font-medium text-orange-700">Total Quantity</label>
                            <p className="text-2xl font-bold text-orange-600 mt-1">{sale.quantity_sold}</p>
                            <p className="text-xs text-orange-600 mt-1">Pairs of shoes</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <label className="text-xs font-medium text-green-700">Total Amount</label>
                            <p className="text-2xl font-bold text-green-600 mt-1">{formatNumber(sale.total_amount)} RWF</p>
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500">Sale Date</label>
                            <p className="text-sm text-gray-900 mt-1">
                                {new Date(sale.sale_date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Sale Time</label>
                            <p className="text-sm text-gray-900 mt-1">
                                {new Date(sale.sale_date).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {sale.notes && (
                        <div>
                            <label className="text-xs font-medium text-gray-500">Notes</label>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                                {sale.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}