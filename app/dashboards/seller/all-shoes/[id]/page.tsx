"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, Palette, Ruler, Package } from 'lucide-react';
import Link from 'next/link';
import { API_ENDPOINTS, getApiUrl } from '@/utils/env';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TriangleLeftIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import UpdateShoeForm from '../update-shoe/page';

interface Shoe {
    shoe_id: string;
    brand: string;
    model_name: string;
    category: string;
    price_retail: string;
    description: string;
    colors: string[];
    sizes: string[];
    image_urls: string[];
    createdAt: string;
    updatedAt: string;
    initial_stock: number;
    stock_added: number;
    stockOut: number;
    stockRemaining: number;
}

export default function SingleShoePage() {
    const params = useParams();
    const router = useRouter();
    const [shoe, setShoe] = useState<Shoe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string) => {
        return `RWF ${parseFloat(price).toLocaleString()}`;
    };

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

                // For now, we'll get the shoe from the list (since we don't have a single shoe endpoint)
                // In a real app, you'd have an endpoint like `/shoes/${id}`
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
                const errorMessage = error instanceof Error && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch shoe'
                    : 'Failed to fetch shoe';
                console.error('Error fetching shoe:', errorMessage);
                toast.error(errorMessage);
                router.push('/dashboards/seller/all-shoes');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchShoe();
        }
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 items-center justify-center min-h-screen text-sm">
                <Spinner className='text-orange-500 size-10' />
                <p>Loading Shoes Details...</p>
            </div>
        );
    }

    if (!shoe) {
        return (
            <div className="flex items-center justify-center min-h-screen text-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Shoe not found</h2>
                    <p className="text-gray-600 mb-4">The shoe you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/dashboards/seller/all-shoes"
                        className="inline-flex items-center gap-2 text-white bg-orange-500 px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Shoes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/dashboards/seller/all-shoes"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors duration-200 cursor-pointer text-sm"
                    >
                        <TriangleLeftIcon />
                        Back to All Shoes
                    </Link>


                    <div className="flex items-center gap-3 text-sm">

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {shoe.image_urls && shoe.image_urls.length > 0 ? (
                                <div className="w-full h-full">
                                    <Image
                                        src={shoe.image_urls[selectedImageIndex]}
                                        alt={`${shoe.brand} ${shoe.model_name}`}
                                        className="w-full h-full object-cover"
                                        width={300}
                                        height={300}
                                        quality={100}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No image available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {shoe.image_urls && shoe.image_urls.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {shoe.image_urls.map((imageUrl, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                                            }`}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={`${shoe.brand} ${shoe.model_name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={300}
                                            height={300}
                                            quality={100}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-sm font-medium rounded-full">
                                {shoe.category}
                            </span>

                            <h1 className="text-3xl font-semibold text-gray-900 mt-2">
                                {shoe.brand} {shoe.model_name}
                            </h1>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                {shoe.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Retail Price</span>
                            </div>
                            <p className="text-3xl font-semibold text-orange-600">
                                {formatPrice(shoe.price_retail)}
                            </p>
                        </div>

                        {/* Colors */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Palette strokeWidth={1.5} size={16} />
                                <h3 className="text-lg font-semibold text-gray-900">Available Colors</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {shoe.colors.map((color, index) => (
                                    <div key={index} className="flex items-center gap-[4px]">
                                        <div
                                            className={`w-3 h-3 rounded-full ${getColorClass(color)}`}
                                            title={color}
                                        />
                                        <span className="text-xs text-gray-700 capitalize">{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Ruler strokeWidth={1.5} size={16} />
                                <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {shoe.sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-3 py-2 border rounded-md text-xs font-medium transition-colors duration-200 ${selectedSize === size
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-gray-200 text-gray-700 hover:border-orange-300'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Package strokeWidth={1.5} size={16} />
                                <h3 className="text-lg font-semibold text-gray-900">Stock Information</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-green-600">{shoe.stockRemaining}</p>
                                    <p className="text-sm text-gray-600">In Stock</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-blue-600">{shoe.stock_added}</p>
                                    <p className="text-xs text-gray-600">Added</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-red-600">{shoe.stockOut}</p>
                                    <p className="text-xs text-gray-600">Sold</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-purple-600">{shoe.initial_stock}</p>
                                    <p className="text-xs text-gray-600">Initial</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Created:</span>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(shoe.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Last Updated:</span>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(shoe.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <UpdateShoeForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shoeId={shoe.shoe_id}
                initialData={{
                    brand: shoe.brand,
                    model_name: shoe.model_name,
                    category: shoe.category,
                    price_retail: shoe.price_retail,
                    description: shoe.description,
                    colors: shoe.colors,
                    sizes: shoe.sizes,
                    existingImages: shoe.image_urls,
                    stockToAdd: ''
                }}
            />
        </div>
    );
}