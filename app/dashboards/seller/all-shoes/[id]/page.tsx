"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Ruler, Package, ShoppingCart, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { API_ENDPOINTS, getApiUrl } from '@/utils/env';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TriangleLeftIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import UpdateShoeForm from '../update-shoe/page';

interface SizeInventoryItem {
    size: string;
    price: number;
    quantity: number;
}

interface Shoe {
    shoe_id: string;
    brand: string;
    initial_stock: number;
    newStock: number;
    stockOut: number;
    stockRemaining: string | number;
    size_inventory: SizeInventoryItem[];
    user_id: number;
    image_urls: string[];
    createdAt: string;
    updatedAt: string;
}

export default function SingleShoePage() {
    const params = useParams();
    const router = useRouter();
    const [shoe, setShoe] = useState<Shoe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        const fetchShoe = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication required');
                    router.push('/sign-in');
                    return;
                }

                const response = await axios.get(getApiUrl(API_ENDPOINTS.SHOES.LIST_USER_SHOES), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const foundShoe = response.data.data.find((s: Shoe) => s.shoe_id === params.id);
                if (foundShoe) {
                    setShoe(foundShoe);
                } else {
                    toast.error('Shoe not found');
                    router.push('/dashboards/seller/all-shoes');
                }
            } catch (error: unknown) {
                console.error('Error fetching shoe:', error);
                toast.error('Failed to load shoe details');
                router.push('/dashboards/seller/all-shoes');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchShoe();
        }
    }, [params.id, router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Function to calculate total cost for all pairs of a single size
    const calculateTotalCostForSize = (item: SizeInventoryItem) => {
        return item.quantity * item.price;
    };

    // Function to calculate total value of all inventory
    const calculateTotalInventoryValue = () => {
        if (!shoe?.size_inventory) return 0;
        return shoe.size_inventory.reduce((total, item) => total + calculateTotalCostForSize(item), 0);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
                <Spinner className='text-orange-500 size-10' />
                <p>Loading...</p>
            </div>
        );
    }

    if (!shoe) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Shoe not found</h2>
                    <p className="text-gray-600 mb-4">The shoe you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/dashboards/seller/all-shoes"
                        className="inline-flex items-center gap-2 text-white bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Shoes
                    </Link>
                </div>
            </div>
        );
    }

    const totalInventoryValue = calculateTotalInventoryValue();

    return (
        <div className="min-h-screen bg-white text-sm">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/dashboards/seller/all-shoes"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                        >
                            <TriangleLeftIcon className="w-4 h-4" />
                            Back to All Shoes
                        </Link>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Product Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <div className="flex items-start gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                {shoe.image_urls && shoe.image_urls.length > 0 ? (
                                    <Image
                                        src={shoe.image_urls[0]}
                                        alt={shoe.brand}
                                        className="w-full h-full object-cover"
                                        width={128}
                                        height={128}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{shoe.brand}</h1>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Package className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Available</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{shoe.stockRemaining}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <ShoppingCart className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">Sold</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{shoe.stockOut}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Plus className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">Added</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{shoe.newStock}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Started With</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{shoe.initial_stock}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Additional Images & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Additional Images */}
                        {shoe.image_urls && shoe.image_urls.length > 1 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">More Photos</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {shoe.image_urls.slice(1).map((imageUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index + 1)}
                                            className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden hover:border-orange-500 transition-colors"
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={`${shoe.brand} ${index + 2}`}
                                                className="w-full h-full object-cover"
                                                width={100}
                                                height={100}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Date Added</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(shoe.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(shoe.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Size Inventory */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Ruler className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <h2 className="font-semibold text-gray-900">Available Sizes</h2>
                                        <p className="text-sm text-gray-600">Stock and prices for each size</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Size
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Price per Pair
                                            </th>
                                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                                Available Pairs
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Total Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {shoe.size_inventory && shoe.size_inventory.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-500/10 text-orange-600 rounded-full font-semibold">
                                                        {item.size}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {item.price.toLocaleString()} Rwf
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-800 font-semibold text-sm rounded-md min-w-20">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {calculateTotalCostForSize(item).toLocaleString()} Rwf
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* Table Footer */}
                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900" colSpan={3}>
                                                Total Inventory Value
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-orange-600">
                                                    {totalInventoryValue.toLocaleString()} Rwf
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900" colSpan={3}>
                                                Total Available Pairs
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-md">
                                                    {shoe.stockRemaining}
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Simple Summary */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{shoe.initial_stock}</p>
                                    <p className="text-sm text-gray-600">Started With</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">+{shoe.newStock}</p>
                                    <p className="text-sm text-gray-600">More Added</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">-{shoe.stockOut}</p>
                                    <p className="text-sm text-gray-600">Sold</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-900">
                                    Now you have <span className="text-green-600">{shoe.stockRemaining}</span> pairs available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Shoe Modal */}
            <UpdateShoeForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shoeId={shoe.shoe_id}
                initialData={{
                    brand: shoe.brand,
                    existingImages: shoe.image_urls,
                    stockToAdd: '',
                    model_name: '',
                    category: '',
                    price_retail: shoe.size_inventory?.[0]?.price?.toString() || '0',
                    description: '',
                    colors: [],
                    sizes: shoe.size_inventory?.map(item => item.size) || []
                }}
            />
        </div>
    );
}