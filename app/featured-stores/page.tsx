"use client";

import { useEffect, useState, useMemo } from 'react';
import { ChatBubbleIcon, EyeOpenIcon, Cross2Icon, TriangleLeftIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Filter, Grid3X3, List, Stars, Search } from 'lucide-react';
import axios from 'axios';

interface Shoe {
    shoe_id: string;
    brand: string;
    model_name: string;
    category: string;
    stockRemaining: number;
    colors: string[];
    sizes: string[];
    price_retail: string;
    description: string;
    image_urls: string[];
    owner: {
        id: string;
        name: string;
        phoneNumber: string;
        location?: string;
    };
    rating?: number;
    isFavorite?: boolean;
}

type SortOption = 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';
type ViewMode = 'grid' | 'list';

export default function FeatureStores() {
    // State management
    const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
    const [shoes, setShoes] = useState<Shoe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/featured-shoes`);
                const fetchedShoes = response.data.data || [];
                setShoes(fetchedShoes);
            } catch (err: unknown) {
                setError((err as { message?: string })?.message || 'Failed to fetch shoes');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get unique brands and categories for filters
    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(shoes.map(shoe => shoe.brand))];
        return uniqueBrands.sort();
    }, [shoes]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(shoes.map(shoe => shoe.category))];
        return uniqueCategories.sort();
    }, [shoes]);

    // Filter and sort shoes
    const filteredAndSortedShoes = useMemo(() => {
        const filtered = shoes.filter(shoe => {
            const matchesSearch = shoe.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shoe.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shoe.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesBrand = selectedBrand === 'all' || shoe.brand === selectedBrand;
            const matchesCategory = selectedCategory === 'all' || shoe.category === selectedCategory;

            const price = parseFloat(shoe.price_retail);
            const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

            return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
        });

        // Sort shoes
       const sortedShoes = filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price_retail) - parseFloat(b.price_retail);
                case 'price-high':
                    return parseFloat(b.price_retail) - parseFloat(a.price_retail);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                    return new Date(b.shoe_id).getTime() - new Date(a.shoe_id).getTime();
                case 'popular':
                default:
                    return b.stockRemaining - a.stockRemaining;
            }
        });

        return sortedShoes;
    }, [shoes, searchQuery, selectedBrand, selectedCategory, priceRange, sortBy]);

    // Toggle favorite
    const toggleFavorite = (shoeId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(shoeId)) {
                newFavorites.delete(shoeId);
            } else {
                newFavorites.add(shoeId);
            }
            return newFavorites;
        });
    };


    // Contact handlers
    const handleContact = (type: string, contact: string) => {
        if (type === 'phone') {
            window.location.href = `tel:${contact}`;
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/${contact.replace(/\+/g, '')}`, '_blank');
        }
    };

    const handleShare = async (shoe: Shoe) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${shoe.brand} ${shoe.model_name}`,
                    text: `Check out this amazing shoe: ${shoe.brand} ${shoe.model_name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shoe.brand} ${shoe.model_name} - ${window.location.href}`);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Error component
    const ErrorComponent = () => (
        <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-sm">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-6 pt-24 pb-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center text-xs gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full text-orange-300 font-medium mb-6">
                                <Stars strokeWidth={1.5} size={16} />
                                Premium Featured Collection
                            </div>
                            <h1 className="text-4xl md:text-4xl mb-4 text-white">
                                Featured Products
                            </h1>
                            <p className="text-gray-300 text-sm md:text-sm max-w-2xl mx-auto leading-relaxed">
                                Discover the finest collection of premium shoes from top-rated sellers
                            </p>
                        </div>

                        {/* Search and Controls */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1 relative">
                                        <Search strokeWidth={1.5} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Search by brand, model, or category..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>

                                    {/* Sort and View Controls */}
                                    <div className="flex gap-3">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="popular">Most Popular</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="newest">Newest First</option>
                                        </select>

                                        <button
                                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                            className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 hover:bg-white transition-all duration-200 flex items-center gap-2"
                                        >
                                            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2"
                                        >
                                            <Filter className="w-4 h-4" />
                                            Filters
                                        </button>
                                    </div>
                                </div>

                                {/* Filters Panel */}
                                {showFilters && (
                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Brand Filter */}
                                            <div>
                                                <label className="block text-white text-sm font-medium mb-2">Brand</label>
                                                <select
                                                    value={selectedBrand}
                                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value="all">All Brands</option>
                                                    {brands.map(brand => (
                                                        <option key={brand} value={brand}>{brand}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Category Filter */}
                                            <div>
                                                <label className="block text-white text-sm font-medium mb-2">Category</label>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value="all">All Categories</option>
                                                    {categories.map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Price Range */}
                                            <div>
                                                <label className="block text-white text-sm font-medium mb-2">Price Range</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={priceRange[0]}
                                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                        className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-orange-500"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={priceRange[1]}
                                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                                                        className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-orange-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center mt-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium cursor-pointer rounded-md hover:bg-white/20 transition-all duration-200"
                            >
                                <TriangleLeftIcon className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {filteredAndSortedShoes.length} Premium Products
                        </h2>
                        <p className="text-gray-600">
                            Showing {filteredAndSortedShoes.length} of {shoes.length} featured products
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <div className="text-center flex flex-col items-center justify-center gap-2">
                            <div className="text-lg text-orange-600 bg-orange-500/10 rounded-md px-2 py-1">{brands.length}</div>
                            <div className="text-xs text-gray-600">Brands</div>
                        </div>
                        <div className="text-center flex flex-col items-center justify-center gap-2">
                            <div className="text-lg text-orange-600 bg-orange-500/10 rounded-md px-2 py-1">{categories.length}</div>
                            <div className="text-xs text-gray-600">Categories</div>
                        </div>
                        <div className="text-center flex flex-col items-center justify-center gap-2">
                            <div className="text-lg text-orange-600 bg-orange-500/10 rounded-md px-2 py-1">
                                {shoes.reduce((sum, shoe) => sum + shoe.stockRemaining, 0)}
                            </div>
                            <div className="text-xs text-gray-600">In Stock</div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && <LoadingSkeleton />}

                {/* Error State */}
                {error && <ErrorComponent />}

                {/* Products Grid */}
                {!loading && !error && (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }>
                        {filteredAndSortedShoes.map((shoe) => (
                            <div
                                key={shoe.shoe_id}
                                className={`group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex' : ''
                                    }`}
                                onClick={() => setSelectedShoe(shoe)}
                            >
                                {/* Image Section */}
                                <div className={`relative overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'
                                    }`}>
                                    <Image
                                        src={shoe.image_urls[0]}
                                        alt={`${shoe.brand} ${shoe.model_name}`}
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        fill
                                        sizes={viewMode === 'list' ? "200px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                                    />

                                    {/* Overlay Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {shoe.stockRemaining < 10 && (
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                Only {shoe.stockRemaining} left!
                                            </span>
                                        )}
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                                            FEATURED
                                        </span>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl text-gray-900 font-bold shadow-lg">
                                        RWF {parseInt(shoe.price_retail).toLocaleString()}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(shoe.shoe_id);
                                            }}
                                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${favorites.has(shoe.shoe_id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                                                }`}
                                        >
                                            <HeartIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(shoe);
                                            }}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                                        >
                                            <Share1Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {shoe.model_name}
                                    </h3>

                                    {/* Colors and Sizes */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>{shoe.colors.length} colors</span>
                                        <span>•</span>
                                        <span>{shoe.sizes.length} sizes</span>
                                    </div>

                                    {/* Seller Info */}
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {shoe.owner.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{shoe.owner.name}</p>
                                            <p className="text-xs text-gray-500">Verified Seller</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2">
                                            <EyeOpenIcon className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContact('whatsapp', shoe.owner.phoneNumber);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                                        >
                                            <ChatBubbleIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredAndSortedShoes.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search criteria or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedBrand('all');
                                setSelectedCategory('all');
                                setPriceRange([0, 1000000]);
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Enhanced Shoe Detail Modal */}
            {selectedShoe && (
                <div className="fixed inset-0 bg-white/10 h-screen w-screen backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white border border-gray-200 rounded-lg h-full w-full my-8 overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedShoe(null)}
                            className="absolute top-6 right-6 w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 z-10 shadow-lg"
                        >
                            <Cross2Icon className="w-6 h-6" />
                        </button>

                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Image Section */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                                <div className="space-y-6">
                                    {/* Main Image */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                                        <Image
                                            src={selectedShoe.image_urls[0]}
                                            alt={`${selectedShoe.brand} ${selectedShoe.model_name}`}
                                            className="object-cover"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />

                                        {/* Favorite Button */}
                                        <button
                                            onClick={() => toggleFavorite(selectedShoe.shoe_id)}
                                            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${favorites.has(selectedShoe.shoe_id)
                                                ? 'bg-red-500 text-white shadow-lg'
                                                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                                                }`}
                                        >
                                            <HeartIcon className="w-5 h-5" />
                                        </button>

                                        {/* Share Button */}
                                        <button
                                            onClick={() => handleShare(selectedShoe)}
                                            className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                                        >
                                            <Share1Icon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Thumbnail Images */}
                                    {selectedShoe.image_urls.length > 1 && (
                                        <div className="grid grid-cols-4 gap-3">
                                            {selectedShoe.image_urls.map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                                                    <Image
                                                        src={url}
                                                        alt={`View ${idx + 1}`}
                                                        className="object-cover"
                                                        fill
                                                        sizes="100px"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="p-8 flex flex-col">
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full">
                                                FEATURED
                                            </span>
                                        </div>

                                        <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-2">
                                            {selectedShoe.brand}
                                        </p>
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                            {selectedShoe.model_name}
                                        </h2>

                                        <div className="text-2xl font-semibold text-gray-900 mb-4">
                                            {parseInt(selectedShoe.price_retail).toLocaleString()} RWF
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{selectedShoe.description}</p>
                                    </div>

                                    {/* Colors */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Colors</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedShoe.colors.map((color, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-orange-100 hover:border-orange-300 transition-colors">
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Sizes</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedShoe.sizes.map((size, idx) => (
                                                <span key={idx} className="w-12 h-12 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium flex items-center justify-center hover:bg-orange-100 hover:border-orange-300 transition-colors cursor-pointer">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Info */}
                                    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                            <p className="text-gray-700 font-medium">
                                                <span className="font-bold text-orange-600">{selectedShoe.stockRemaining} pairs</span> currently available
                                            </p>
                                        </div>
                                        {selectedShoe.stockRemaining < 10 && (
                                            <p className="text-red-600 text-sm font-medium mt-2">
                                                ⚠️ Limited stock - Order soon!
                                            </p>
                                        )}
                                    </div>

                                    {/* Seller Info */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                                {selectedShoe.owner.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{selectedShoe.owner.name}</p>
                                                <p className="text-sm text-gray-600">Verified Premium Seller</p>
                                                <p className="text-sm text-gray-500">{selectedShoe.owner.location || 'Location not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Actions */}
                                <div className="space-y-4 pt-6 border-t border-gray-200">
                                    <p className="text-gray-600 text-sm font-medium">
                                        Contact {selectedShoe.owner.name} to purchase this item:
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleContact('phone', selectedShoe.owner.phoneNumber)}
                                            className="flex items-center cursor-pointer justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Call Now
                                        </button>
                                        <button
                                            onClick={() => handleContact('whatsapp', selectedShoe.owner.phoneNumber)}
                                            className="flex items-center cursor-pointer justify-center gap-3 px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            <ChatBubbleIcon className="w-5 h-5" />
                                            WhatsApp
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 text-center">
                                        All transactions are handled directly with the seller
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}