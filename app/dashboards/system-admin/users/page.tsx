'use client'

import { usePaginatedData } from '@/app/components/hooks/usePagination';
import { getApiUrl, API_ENDPOINTS } from '@/utils/env';
import { Edit, Eye, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';


interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    status: 'active' | 'inactive' | 'pending';
    isSubscriptionActive: boolean;
  }

export default function SellersTable() {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();
  const {
  data: users,
  pagination,
  isLoading,
  filters,
  updateFilters,
  handlePageChange,
  searchTerm,
  handleSearch
} = usePaginatedData<User>(
  getApiUrl(API_ENDPOINTS.USER.LIST),
  {
    status: '',
    search: ''
  }
);

  // Client-side sorting (since server doesn't handle sorting)
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (sortDirection === 'asc') {
        return aValue && bValue ? aValue > bValue ? 1 : -1 : 0;
      } else {
        return aValue && bValue ? aValue < bValue ? 1 : -1 : 0;
      }
    });
  }, [users, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, label }: { field: string; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium hover:text-orange-500 transition-colors"
    >
      {label}
      {sortField === field && (
        <span className="text-orange-500">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
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
            <h2 className="text-lg font-semibold text-gray-900">Sellers</h2>
            <p className="text-xs text-gray-500">Manage your sellers and their accounts</p>
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
              placeholder="Search sellers by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-[250px] pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="subscribed">Subscribed</option>
              <option value="pending">Pending</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="name" label="Name" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="email" label="Email" />
              </th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">
                <SortButton field="status" label="Status" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="createdAt" label="Created" />
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No sellers found matching your criteria
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors text-xs">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">ID: {user?.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isSubscriptionActive === true ? 'bg-green-100 text-green-800' : user.isSubscriptionActive === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {
                        (user.isSubscriptionActive === true) ? 'Subscribed' : (user.isSubscriptionActive === false) ? 'Unsubscribed' : 'Pending'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="bg-orange-500/10 cursor-pointer p-2 w-8 h-8 flex items-center justify-center rounded-full text-orange-600 hover:text-orange-900 transition-colors">
                        <Edit strokeWidth={1.5} size={16} />
                      </button>
                      <button 
                        onClick={() => router.push(`/dashboards/system-admin/users/${user.id}`)}
                      className="bg-blue-500/10 cursor-pointer p-2 w-8 h-8 flex items-center justify-center rounded-full text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye strokeWidth={1.5} size={16} />
                      </button>
                    </div>
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
                      className={`px-3 py-1 rounded transition-colors disabled:cursor-not-allowed ${
                        pagination.page === pageNum 
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
    </div>
  );
}