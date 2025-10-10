"use client";

import { useRecordSales } from "@/app/components/hooks/useRecordSales";
import { useShoes } from "@/app/components/hooks/useShoes";
import { Spinner } from "@radix-ui/themes";
import { Eye, Edit, Trash2, Plus, BoxIcon, DollarSign, Calendar, Search, X, XCircle, CheckCircle } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useState, useMemo } from 'react';

export interface Shoe {
  shoe_id?: string;
  brand: string;
  model_name: string;
  category: string;
  stockin: string;
  price_retail: string;
  description: string;
  colors: string[];
  sizes: string[];
  images: string[];
  image_urls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AllShoesPage() {
  const { shoes, isFetching } = useShoes();
  const [isRecordingSales, setIsRecordingSales] = useState(false);
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  // Add selected shoe state
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': 'bg-black',
      'white': 'bg-white border border-gray-300',
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-400',
      'orange': 'bg-orange-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
      'brown': 'bg-amber-700',
      'gray': 'bg-gray-500',
      'navy': 'bg-blue-800',
      'beige': 'bg-amber-200',
      'gold': 'bg-yellow-500',
      'silver': 'bg-gray-400'
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-400';
  };

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    if (!shoes) return [];
    return [...new Set(shoes.map((shoe) => shoe.category))];
  }, [shoes]);

  const uniqueColors = useMemo(() => {
    if (!shoes) return [];
    const allColors = shoes.flatMap((shoe) => shoe.colors);
    return [...new Set(allColors)];
  }, [shoes]);

  // Filter and sort shoes
  const filteredShoes = useMemo(() => {
    if (!shoes) return [];

    const filtered = shoes.filter((shoe) => {
      // Search filter
      const matchesSearch = !searchTerm ||
        shoe.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || shoe.category === selectedCategory;

      // Price range filter
      const price = parseFloat(shoe.price_retail);
      const matchesPriceMin = !priceRange.min || price >= parseFloat(priceRange.min);
      const matchesPriceMax = !priceRange.max || price <= parseFloat(priceRange.max);

      // Color filter
      const matchesColor = !selectedColor || shoe.colors.includes(selectedColor);

      return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax && matchesColor;
    });

    // Sort shoes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date((b as Shoe).createdAt || '').getTime() - new Date((a as Shoe).createdAt || '').getTime();
        case 'oldest':
          return new Date((a as Shoe).createdAt || '').getTime() - new Date((b as Shoe).createdAt || '').getTime();
        case 'price-low':
          return parseFloat(a.price_retail) - parseFloat(b.price_retail);
        case 'price-high':
          return parseFloat(b.price_retail) - parseFloat(a.price_retail);
        case 'name':
          return `${a.brand} ${a.model_name}`.localeCompare(`${b.brand} ${b.model_name}`);
        default:
          return 0;
      }
    });

    return filtered;
  }, [shoes, searchTerm, selectedCategory, priceRange, selectedColor, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedColor('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedCategory || priceRange.min || priceRange.max || selectedColor;



  return (
    <div className="p-6 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">All Shoes</h1>
          <p className="text-gray-600 mt-2">Manage your shoe inventory</p>
        </div>
        <Link
          href="/dashboards/seller/create-shoes"
          className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-md cursor-pointer transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Shoe
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shoes</p>
              <p className="text-2xl font-semibold text-gray-900">{shoes?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <BoxIcon strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(shoes?.map((shoe) => shoe.category)).size || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
              <BoxIcon strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                <span className="text-sm">RWF</span> {shoes?.reduce((total: number, shoe) => total + parseFloat(shoe.price_retail), 0).toString() || '0'}
              </p>
            </div>
            <div className="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center">
              <DollarSign strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {shoes?.filter((shoe) => {
                  const shoeDate = new Date((shoe as Shoe).createdAt || '');
                  const now = new Date();
                  return shoeDate.getMonth() === now.getMonth() && shoeDate.getFullYear() === now.getFullYear();
                }).length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Calendar strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by brand, model, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
            >
              <option value="">All Colors</option>
              {uniqueColors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
              />
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredShoes.length} of {shoes?.length || 0} shoes
            {hasActiveFilters && (
              <span className="ml-2 text-orange-500 font-medium">
                (filtered)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Shoes Grid */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <Spinner className="w-full h-48" />
          <p className="text-gray-600 mt-4">Loading shoes...</p>
        </div>
      ) : filteredShoes && filteredShoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShoes.map((shoe, index) => (
            <div key={(shoe as Shoe).shoe_id || `shoe-${index}`} className="bg-white rounded-md border border-gray-100 hover:shadow transition-all duration-200 overflow-hidden group">
              {/* Image */}
              <div className="relative h-38 bg-gray-100">
                {((shoe as Shoe).image_urls && (shoe as Shoe).image_urls!.length > 0) || (shoe.images && shoe.images.length > 0) ? (
                  <Image
                    src={(shoe as Shoe).image_urls?.[0] || shoe.images[0]}
                    alt={`${shoe.brand} ${shoe.model_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    width={300}
                    height={152}
                    quality={90}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-[#CA425A] text-white text-xs font-medium rounded-full">
                    {shoe.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboards/seller/all-shoes/${(shoe as Shoe).shoe_id || index}`}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedShoe(shoe as Shoe); // Set the clicked shoe
                        setIsRecordingSales(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-md mb-1">
                    {shoe.brand} {shoe.model_name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-orange-500 bg-orange-50 px-4 font-semibold py-1 rounded-full text-xs">
                    {shoe.price_retail}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate((shoe as Shoe).createdAt || '')}
                  </span>
                </div>

                {/* Colors */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Colors</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {shoe.colors.slice(0, 6).map((color, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${getColorClass(color)}`}
                        title={color}
                      />
                    ))}
                    {shoe.colors.length > 6 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{shoe.colors.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shoes found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first shoe to the inventory.</p>
          <Link
            href="/dashboards/seller/create-shoes"
            className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-md cursor-pointer hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            <Plus strokeWidth={1.5} size={16} />
            Add Your First Shoe
          </Link>
        </div>
      )}

      {isRecordingSales && selectedShoe && (
        <RecordSalesModal
          setIsRecordingSales={setIsRecordingSales}
          shoe={selectedShoe}
        />
      )}
    </div>
  );
}

export const RecordSalesModal = ({ setIsRecordingSales, shoe }: { setIsRecordingSales: (isRecordingSales: boolean) => void } & { shoe: Shoe }) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useRecordSales({
    shoe_id: shoe.shoe_id || '',
    quantity_sold: 0,
    notes: ''
  }, () => {
    // Close modal on successful sale recording
    setIsRecordingSales(false);
  });

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="p-2 bg-orange-500/5 text-orange-500 rounded-full"><Eye strokeWidth={1.5} size={16} /></span>
          Record Sales
        </h2>
        <h1 className="text-gray-900 flex items-center gap-2 my-5">
          Shoe Name: <span className="font-semibold bg-orange-500/5 text-orange-500 rounded-full px-4 py-1 h-8 flex items-center justify-center capitalize">
            {shoe.brand} {shoe.model_name}
          </span>
        </h1>
        <div className="space-y-3">
          <span className="text-sm text-gray-500">Shoe ID</span>
          <input
            type="text"
            className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none"
            {...register('shoe_id')}
            readOnly
          />
          {errors.shoe_id && <p className="text-red-500 text-xs">{errors.shoe_id.message}</p>}
        </div>
        <div className="space-y-3">
          <span className="text-sm text-gray-500">Quantity Sold</span>
          <input
            type="number"
            className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none"
            {...register('quantity_sold', { valueAsNumber: true })}
          />
          {errors.quantity_sold && <p className="text-red-500 text-xs">{errors.quantity_sold.message}</p>}
        </div>
        <div className="space-y-3">
          <span className="text-sm text-gray-500">Notes</span>
          <textarea
            rows={3}
            className="w-full p-2 rounded-md border border-gray-200 focus:border-1 focus:border-orange-500 focus:outline-none"
            {...register('notes')}
          />
          {errors.notes && <p className="text-red-500 text-xs">{errors.notes.message}</p>}
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsRecordingSales(false)}
            className="w-full flex text-black items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <XCircle strokeWidth={1.5} size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center whitespace-nowrap gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-colors"
          >
            {isSubmitting ? <Spinner /> : <CheckCircle strokeWidth={1.5} size={16} />}
            Submit Sales
          </button>
        </div>
      </form>
    </div>
  );
}