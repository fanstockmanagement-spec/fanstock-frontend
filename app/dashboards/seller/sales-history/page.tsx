'use client'

import useSalesHistory, { SalesHistory } from '@/app/components/hooks/useSalesHistory';

import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';

export default function SellersTable() {
    const { salesHistory, isLoadingSales: salesLoading } = useSalesHistory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<SalesHistory | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Get unique brands from sales history for filters
    const uniqueBrands = useMemo(() => {
        const brands = salesHistory
            .map(sale => sale.shoe_brand)
            .filter((brand): brand is string => !!brand) // Filter out null/undefined
            .filter((brand, index, self) => self.indexOf(brand) === index); // Get unique values

        return brands.slice(0, 10); // Limit to top 10 brands
    }, [salesHistory]);

    // Filter sales history based on search term
    const filteredSales = useMemo(() => {
        if (!searchTerm.trim()) return salesHistory;

        const term = searchTerm.toLowerCase();
        return salesHistory.filter(sale =>
            sale.shoe_brand?.toLowerCase().includes(term) ||
            sale.sale_id?.toString().toLowerCase().includes(term) ||
            sale.notes?.toLowerCase().includes(term) ||
            sale.items_sold.some(item =>
                item.size.toString().includes(term)
            )
        );
    }, [salesHistory, searchTerm]);

    // Handle search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Pagination logic for filtered results
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3 columns × 3 rows

    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSales.slice(startIndex, endIndex);
    }, [filteredSales, currentPage]);

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
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
                    {salesLoading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                            Loading...
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 w-full">
                <div className="flex flex-col space-y-4">
                    {/* Main Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand, shoe ID, size, or notes..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Filter by:</span>
                        <button
                            onClick={() => handleSearch('')}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${!searchTerm ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            All Sales
                        </button>
                        {uniqueBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => handleSearch(brand)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${searchTerm === brand ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                {brand}
                            </button>
                        ))}
                        {uniqueBrands.length === 0 && !salesLoading && (
                            <span className="text-xs text-gray-400">No brands available</span>
                        )}
                    </div>

                    {/* Results Count */}
                    {searchTerm && (
                        <div className="text-xs text-gray-500">
                            Showing {filteredSales.length} {filteredSales.length === 1 ? 'sale' : 'sales'} for &quot;{searchTerm}&quot;
                        </div>
                    )}
                    {!searchTerm && filteredSales.length > 0 && (
                        <div className="text-xs text-gray-500">
                            Showing {filteredSales.length} {filteredSales.length === 1 ? 'sale' : 'sales'} in total
                        </div>
                    )}
                </div>
            </div>

            {/* Sales Cards Grid */}
            <div className="p-4 sm:p-6">
                {filteredSales.length === 0 && !salesLoading ? (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm ? `No sales history found for "${searchTerm}"` : 'No sales history found'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedSales.map((sale) => (
                            <div
                                key={sale.sale_id}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleRowClick(sale)}
                            >
                                {/* Card Header */}
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 bg-orange-500 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={sale.shoe_image || ''}
                                                    alt={sale.shoe_brand || ''}
                                                    className="object-cover w-full h-full"
                                                    width={32}
                                                    height={32}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{sale.shoe_brand}</h3>
                                                <p className="text-xs text-gray-500">{new Date(sale.sale_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600">
                                            {formatNumber(sale.total_amount)} RWF
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    {/* Sizes Grid */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {sale.items_sold.map((item, index) => (
                                            <div key={index} className="border border-gray-100 rounded p-2 text-center">
                                                <div className="text-xs font-medium text-gray-900">Size {item.size}</div>
                                                <div className="text-xs text-gray-500">{item.quantity} × {formatNumber(item.sold_for)}</div>
                                                <div className="text-xs font-medium text-orange-500">{formatNumber(item.sold_for * item.quantity)} RWF</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                                        <span className="text-gray-500">Total Items:</span>
                                        <span className="font-medium">{sale.total_quantity}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs mt-1">
                                        <span className="text-gray-500">Time:</span>
                                        <span>{new Date(sale.sale_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {sale.notes && (
                                        <div className="mt-2 pt-2 text-xs border-t border-gray-100">
                                            <p className="text-gray-500 truncate">
                                                <span className="font-medium">Note:</span> {sale.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Enhanced Footer with Pagination */}
            {filteredSales.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 w-full">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredSales.length)} of{' '}
                                {filteredSales.length} results
                            </span>
                            {salesLoading && (
                                <div className="flex items-center gap-1">
                                    <div className="animate-spin h-3 w-3 border border-orange-500 border-t-transparent rounded-full"></div>
                                    <span>Loading...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1 || salesLoading}
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
                                                disabled={salesLoading}
                                                className={`px-3 py-1 rounded transition-colors disabled:cursor-not-allowed ${currentPage === pageNum
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
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages || salesLoading}
                                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

// SingleSaleHistoryModal component remains the same as in your original code
interface SingleSaleHistoryModalProps {
    sale: SalesHistory;
    isOpen: boolean;
    onClose: () => void;
    formatNumber: (num: string | number) => string;
}

export function SingleSaleHistoryModal({ sale, isOpen, onClose, formatNumber }: SingleSaleHistoryModalProps) {
    if (!isOpen) return null;

    // Calculate total retail price
    const totalRetailPrice = sale.items_sold.reduce((sum, item) => {
        return sum + (item.retail_price * item.quantity);
    }, 0);

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={20} />
                </button>

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Sale Details</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(sale.sale_date).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                            {formatNumber(sale.total_amount)} RWF
                        </span>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                    {/* Shoe Information */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <div className="h-16 w-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                {sale.shoe_image ? (
                                    <Image
                                        src={sale.shoe_image}
                                        alt={sale.shoe_brand || ''}
                                        className="object-cover w-full h-full"
                                        width={64}
                                        height={64}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500">
                                        <span className="text-lg font-medium">{sale.shoe_brand?.charAt(0) || 'N/A'}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate">{sale.shoe_brand}</h3>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                                        {sale.items_sold.length} {sale.items_sold.length === 1 ? 'size' : 'sizes'}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                                        {sale.total_quantity} {sale.total_quantity === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Sale ID: {sale.sale_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Sold */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900">Items Sold</h3>
                        <div className="space-y-3">
                            {sale.items_sold.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 flex items-center justify-center bg-white rounded border border-gray-200">
                                            <span className="text-sm font-medium text-gray-900">{item.size}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Size {item.size}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} × {formatNumber(item.sold_for)} RWF</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{formatNumber(item.sold_for * item.quantity)} RWF</p>
                                        {item.retail_price && (
                                            <p className="text-xs text-gray-500">
                                                Retail: {formatNumber(item.retail_price)} RWF
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Subtotal</span>
                                <span className="text-sm font-medium">{formatNumber(sale.total_amount)} RWF</span>
                            </div>
                            {totalRetailPrice > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Retail Value</span>
                                    <span className="text-sm font-medium">{formatNumber(totalRetailPrice)} RWF</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold text-orange-600">{formatNumber(sale.total_amount)} RWF</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {sale.notes && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-700 whitespace-pre-line">{sale.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}