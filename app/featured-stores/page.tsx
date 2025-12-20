"use client";

import { useEffect, useState, useMemo } from 'react';
import { ChatBubbleIcon, EyeOpenIcon, Cross2Icon, TriangleLeftIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Filter, Search, Store, ShoppingBag } from 'lucide-react';
import axios from 'axios';

interface SizeInventory {
    size: string;
    price: number;
    quantity: number;
}

interface Shoe {
    shoe_id: string;
    brand: string;
    model_name?: string;
    category?: string;
    stockRemaining: number;
    colors?: string[];
    sizes: string[];
    price_retail: number;
    description?: string;
    image_urls: string[];
    size_inventory?: SizeInventory[];
    owner: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        image?: string | null;
        location?: string;
        daysUntilDisplayExpires?: number;
    };
    rating?: number;
    isFavorite?: boolean;
}

interface StoreProfile {
    owner: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        image?: string | null;
        location?: string;
        daysUntilDisplayExpires?: number;
    };
    shoes: Shoe[];
    totalProducts: number;
}

export default function FeatureStores() {
    // State management
    const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
    const [selectedStore, setSelectedStore] = useState<StoreProfile | null>(null);
    const [shoes, setShoes] = useState<Shoe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Helper to enrich shoe data with derived fields
    const enrichShoe = (shoe: any): Shoe => {
        const sizes = shoe.size_inventory?.map((si: SizeInventory) => si.size) ?? [];
        const prices = shoe.size_inventory?.map((si: SizeInventory) => si.price) ?? [0];
        const minPrice = Math.min(...prices);
        return {
            ...shoe,
            model_name: shoe.model_name || shoe.brand,
            category: shoe.category || 'Shoes',
            colors: shoe.colors || sizes,
            sizes: sizes,
            price_retail: minPrice || 0,
            description: shoe.description || 'Premium shoe collection from our seller',
        };
    };
 
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/featured-shoes`);
                const fetchedShoes = (response?.data?.data ?? response?.data ?? [])
                    .map(enrichShoe);
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
   
       console.log("The fetched shoes are " , shoes)
    // Group shoes by store
    const storeProfiles = useMemo(() => {
        const storeMap = new Map<string, StoreProfile>();

        shoes.forEach(shoe => {
            const ownerId = shoe.owner.id.toString();

            if (!storeMap.has(ownerId)) {
                storeMap.set(ownerId, {
                    owner: shoe.owner,
                    shoes: [],
                    totalProducts: 0
                });
            }

            const store = storeMap.get(ownerId)!;
            store.shoes.push(shoe);
            store.totalProducts = store.shoes.length;
        });

        return Array.from(storeMap.values());
    }, [shoes]);

    // Filter stores based on search and filters
    const filteredStores = useMemo(() => {
        return storeProfiles.filter(store => {
            // Search by store name
            const matchesSearch = !searchQuery ||
                store.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                store.shoes.some(shoe =>
                    shoe.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (shoe.model_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (shoe.category || '').toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Filter by brand and category
            const hasMatchingShoes = store.shoes.some(shoe => {
                const matchesBrand = selectedBrand === 'all' || shoe.brand === selectedBrand;
                const matchesCategory = selectedCategory === 'all' || (shoe.category || 'Shoes') === selectedCategory;
                const price = typeof shoe.price_retail === 'number' ? shoe.price_retail : 0;
                const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

                return matchesBrand && matchesCategory && matchesPrice;
            });

            return matchesSearch && hasMatchingShoes;
        });
    }, [storeProfiles, searchQuery, selectedBrand, selectedCategory, priceRange]);

    console.log("The filtered stores are " , filteredStores)
    // Get brands and categories for filters
    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(shoes.map(shoe => shoe.brand))];
        return uniqueBrands.sort();
    }, [shoes]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(shoes.map(shoe => shoe.category))];
        return uniqueCategories.sort();
    }, [shoes]);

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

    const handleShare = async (store: StoreProfile) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${store.owner.name} - Premium Store`,
                    text: `Check out ${store.owner.name}'s featured collection`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${store.owner.name} - ${window.location.href}`);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="p-6 border-b border-gray-200">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-6">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="space-y-3">
                                <div className="h-40 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
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
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center text-xs gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full text-orange-300 font-medium mb-6">
                                <Store strokeWidth={1.5} size={16} />
                                Featured Stores Collection
                            </div>
                            <h1 className="text-4xl md:text-4xl mb-4 text-white">
                                Featured Stores
                            </h1>
                            <p className="text-gray-300 text-sm md:text-sm max-w-2xl mx-auto leading-relaxed">
                                Discover premium shoes from top-rated sellers
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
                                            placeholder="Search by store name, brand, or product..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </button>
                                </div>

                                {/* Filters Panel */}
                                {showFilters && (
                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {filteredStores.length} Featured Stores
                        </h2>
                        <p className="text-gray-600">
                            Discover premium collections from verified sellers
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <div className="text-center flex flex-col items-center justify-center gap-2">
                            <div className="text-lg text-orange-600 bg-orange-500/10 rounded-md px-2 py-1">{storeProfiles.length}</div>
                            <div className="text-xs text-gray-600">Stores</div>
                        </div>
                        <div className="text-center flex flex-col items-center justify-center gap-2">
                            <div className="text-lg text-orange-600 bg-orange-500/10 rounded-md px-2 py-1">{brands.length}</div>
                            <div className="text-xs text-gray-600">Brands</div>
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

                {/* Store Profiles */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredStores.map((store) => {
                            const displayShoes = store.shoes.slice(0, 3);
                            return (
                                <div
                                    key={store.owner.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Store Header */}
                                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xl font-bold">
                                                    {store.owner.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-bold text-gray-900">{store.owner.name}</h3>
                                                        <Image
                                                            src="/verification_mark.jpg"
                                                            alt="Verification Mark"
                                                            width={20}
                                                            height={20}
                                                            className="w-4 h-4"
                                                        />
                                                    </div>
                                                    <div className="flex flex-row items-center gap-3">
                                                        <p className="text-sm text-gray-500">{store.owner.email || 'Not Provided'}</p>
                                                        <hr className="w-[1px] h-4 bg-gray-400" />
                                                        <p className="text-sm text-gray-500">{store.owner.phoneNumber || 'Not Provided'}</p>
                                                    </div>
                                                    {store.owner.location && (
                                                        <p className="text-xs text-gray-400 mt-1">{store.owner.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Store Stats */}
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span className="text-sm font-medium">{store.totalProducts} Products</span>
                                            </div>
                                            <button
                                                onClick={() => handleContact('whatsapp', store.owner.phoneNumber)}
                                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <ChatBubbleIcon className="w-4 h-4" />
                                                Contact
                                            </button>
                                        </div>

                                        {/* Contact Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleContact('phone', store.owner.phoneNumber)}
                                                className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Call Now
                                            </button>
                                            <button
                                                onClick={() => setSelectedStore(store)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <EyeOpenIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Store's Shoes (First 3) */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            {displayShoes.map((shoe) => (
                                                <div
                                                    key={shoe.shoe_id}
                                                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 aspect-square hover:scale-105 transition-transform duration-300"
                                                    onClick={() => setSelectedShoe(shoe)}
                                                >
                                                    <Image
                                                        src={shoe.image_urls[0]}
                                                        alt={`${shoe.brand} ${shoe.model_name}`}
                                                        className="object-cover"
                                                        fill
                                                        sizes="(max-width: 768px) 33vw, 150px"
                                                    />

                                                    {/* Price Badge */}
                                                    {/* <div className="absolute flex flex-row items-center bottom-2 left-2 right-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded text-xs font text-gray-900">
                                                        RWF {(typeof shoe.price_retail === 'number' ? shoe.price_retail : 0).toLocaleString()}
                                                    </div> */}
                                                </div>
                                            ))}
                                        </div>

                                        {/* View More Link */}
                                        {store.shoes.length > 3 && (
                                            <div className="mt-4 text-center">
                                                <button
                                                    onClick={() => setSelectedStore(store)}
                                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    View all {store.shoes.length} products →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredStores.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
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

            {/* Store Detail Modal */}
            {selectedStore && (
                <div className="fixed inset-0 bg-black/50 h-screen w-screen backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white border border-gray-200 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedStore(null)}
                            className="absolute top-6 right-6 w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 z-10 shadow-lg"
                        >
                            <Cross2Icon className="w-6 h-6" />
                        </button>

                        {/* Store Header */}
                        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xl font-bold">
                                    {selectedStore.owner.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-gray-900">{selectedStore.owner.name}</h3>
                                        <Image
                                            src="/verification_mark.jpg"
                                            alt="Verification Mark"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center gap-3">
                                        <p className="text-sm text-gray-500">{selectedStore.owner.email || 'Not Provided'}</p>
                                        <hr className="w-[1px] h-4 bg-gray-400" />
                                        <p className="text-sm text-gray-500">{selectedStore.owner.phoneNumber || 'Not Provided'}</p>
                                    </div>
                                    {selectedStore.owner.location && (
                                        <p className="text-xs text-gray-400 mt-1">{selectedStore.owner.location}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleContact('phone', selectedStore.owner.phoneNumber)}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Now
                                </button>
                                <button
                                    onClick={() => handleContact('whatsapp', selectedStore.owner.phoneNumber)}
                                    className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <ChatBubbleIcon className="w-5 h-5" />
                                    WhatsApp
                                </button>
                            </div>
                        </div>

                        {/* All Products */}
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">All Products ({selectedStore.shoes.length})</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {selectedStore.shoes.map((shoe) => (
                                    <div
                                        key={shoe.shoe_id}
                                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={() => {
                                            setSelectedShoe(shoe);
                                            setSelectedStore(null);
                                        }}
                                    >
                                        <div className="relative h-48 bg-gray-100">
                                            <Image
                                                src={shoe.image_urls[0]}
                                                alt={`${shoe.brand} ${shoe.model_name}`}
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{shoe.model_name || shoe.brand}</h4>
                                            <p className="text-sm text-gray-500">{shoe.brand}</p>
                                            {/* <p className="text-lg font-semibold text-gray-900"><span className="text-gray-500 text-sm">RWF </span>{(typeof shoe.price_retail === 'number' ? shoe.price_retail : 0).toLocaleString()}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shoe Detail Modal */}
            {selectedShoe && (
                <div className="fixed inset-0 bg-black/50 h-screen w-screen backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                                            onClick={() => handleShare({ owner: selectedShoe.owner, shoes: [selectedShoe], totalProducts: 1 })}
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

                                        {/* <div className="text-2xl font-semibold text-gray-900 mb-4">
                                            RWF {(typeof selectedShoe.price_retail === 'number' ? selectedShoe.price_retail : 0).toLocaleString()}
                                        </div> */}
                                    </div>

                                    {/* Description */}
                                    {selectedShoe.description && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{selectedShoe.description}</p>
                                        </div>
                                    )}

                                    {/* Colors / Options */}
                                    {selectedShoe.colors && selectedShoe.colors.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Options</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedShoe.colors.map((color, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-orange-100 hover:border-orange-300 transition-colors">
                                                        {color}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sizes with Prices */}
                                    {selectedShoe.size_inventory && selectedShoe.size_inventory.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size & Price Options</h3>
                                            <div className="space-y-3">
                                                {selectedShoe.size_inventory.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <span className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg font-semibold text-gray-700">
                                                                {item.size}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {item.quantity} available
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-bold text-orange-600">
                                                            RWF {item.price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback Sizes */}
                                    {(!selectedShoe.size_inventory || selectedShoe.size_inventory.length === 0) && selectedShoe.sizes && selectedShoe.sizes.length > 0 && (
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
                                    )}

                                    {/* Stock Info */}
                                    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                            <p className="text-gray-700 font-medium">
                                                {/* <span className="font-bold text-orange-600">{selectedShoe.stockRemaining} pairs</span> currently available */}
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
                                <div className="w-12 h-12 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xl font-bold">
                                    {selectedShoe.owner.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-gray-900">{selectedShoe.owner.name}</h3>
                                        <Image
                                            src="/verification_mark.jpg"
                                            alt="Verification Mark"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center gap-3">
                                        <p className="text-sm text-gray-500">{selectedShoe.owner.email || 'Not Provided'}</p>
                                        <hr className="w-[1px] h-4 bg-gray-400" />
                                        <p className="text-sm text-gray-500">{selectedShoe.owner.phoneNumber || 'Not Provided'}</p>
                                    </div>
                                    {selectedShoe.owner.location && (
                                        <p className="text-xs text-gray-400 mt-1">{selectedShoe.owner.location}</p>
                                    )}
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