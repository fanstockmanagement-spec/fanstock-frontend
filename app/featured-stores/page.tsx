"use client";

import { useEffect, useState } from 'react';
import { ChatBubbleIcon, EyeOpenIcon, Cross2Icon, TriangleLeftIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Map, Phone } from 'lucide-react';
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
    owner:string[]
}

interface Store {
    store_id: number;
    store_name: string;
    owner_name: string;
    location: string;
    phone: string;
    whatsapp: string;
    featuredSubscription: boolean;
    rating: number;
    totalShoes: number;
    featured_shoes: Shoe[];
}

export default function FeatureStores() {
    const [selectedShoe, setSelectedShoe] = useState<(Shoe & { store: Store }) | null>(null);
     

   
  const [dynamics, setDynamics] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/featured-shoes`);
            setDynamics(response.data.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []); 

console.log("The dynamics are " , dynamics)
   

    const handleContact = (type: string, contact: string) => {
        if (type === 'phone') {
            window.location.href = `tel:${contact}`;
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/${contact.replace(/\+/g, '')}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80)',
                        }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 p-6 pt-32 pb-16 text-center">
                        <div className="flex flex-col items-center gap-4 mb-6">
                            
                            <div>
                                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
                                    Featured Stores
                                </h1>
                                <p className="text-gray-200 text-base md:text-lg">
                                    Browse premium shoe retailers in your area
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <TriangleLeftIcon />
                            Go Back Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stores Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-8">
                {dynamics.map((store) => (
                    <div key={store.owner.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Store Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {store.owner.name}
                                        </h2>
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full">
                                            FEATURED
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="font-medium">Owner:</span>
                                            <span>{store.owner.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Map className="w-4 h-4" />
                                            {/* <span>{store.location}</span> */}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <span className="text-orange-500">⭐</span>
                                                <span className="font-medium">{store.rating}</span>
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{store.stockRemaining} shoes in stock</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleContact('phone', store.owner.phoneNumber)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-md hover:from-orange-600 hover:to-red-600 transition-colors duration-150"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call Now
                                    </button>
                                    <button
                                        onClick={() => handleContact('whatsapp', store.owner.phoneNumber)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-150"
                                    >
                                        <ChatBubbleIcon className="w-4 h-4" />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Shoes Grid */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Products</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dynamics.map((shoe) => (
                                    <div
                                        key={shoe.shoe_id}
                                        className="group bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                                        onClick={() => setSelectedShoe({ ...shoe, store })}
                                    >
                                        {/* Shoe Image */}
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <Image
                                                src={shoe.image_urls[0]}
                                                alt={`${shoe.brand} ${shoe.model_name}`}
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-gray-900 text-sm font-semibold">
                                                RWF {shoe.price_retail}
                                            </div>
                                            {shoe.stockRemaining < 10 && (
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
                                                    Only {shoe.stockRemaining} left
                                                </div>
                                            )}
                                        </div>

                                        {/* Shoe Info */}
                                        <div className="p-4">
                                            <p className="text-orange-600 text-sm font-medium mb-1">{shoe.brand}</p>
                                            <h4 className="text-gray-900 text-base font-semibold mb-2">{shoe.model_name}</h4>
                                            <p className="text-gray-500 text-sm mb-3">{shoe.category}</p>

                                            {/* Quick Info */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                <span>{shoe.colors.length} colors</span>
                                                <span>•</span>
                                                <span>{shoe.sizes.length} sizes</span>
                                            </div>

                                            <button className="w-full py-2 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors duration-150 flex items-center justify-center gap-2">
                                                <EyeOpenIcon className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shoe Detail Modal */}
            {selectedShoe && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative bg-white border border-gray-200 rounded-lg max-w-4xl w-full my-8 overflow-hidden shadow-xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedShoe(null)}
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors duration-150 z-10"
                        >
                            <Cross2Icon className="w-5 h-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-8 p-8">
                            {/* Image Section */}
                            <div className="space-y-4">
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={selectedShoe.image_urls[0]}
                                        alt={`RWF {selectedShoe.brand} ${selectedShoe.model_name}`}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                                {selectedShoe.image_urls.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedShoe.image_urls.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity">
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

                            {/* Details Section */}
                            <div className="flex flex-col">
                                <div className="flex-1">
                                    <p className="text-orange-600 font-medium mb-2">{selectedShoe.brand}</p>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedShoe.model_name}</h2>
                                    <div className="text-xl font-semibold text-gray-900 mb-4">RWF {selectedShoe.price_retail}</div>

                                    <p className="text-gray-600 leading-relaxed mb-6">{selectedShoe.description}</p>

                                    {/* Colors */}
                                    <div className="mb-6">
                                        <p className="text-gray-900 font-medium mb-3">Available Colors:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedShoe.colors.map((color, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-sm">
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-6">
                                        <p className="text-gray-900 font-medium mb-3">Available Sizes:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedShoe.sizes.map((size, idx) => (
                                                <span key={idx} className="w-10 h-10 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-sm flex items-center justify-center hover:bg-orange-100 hover:border-orange-300 transition-colors">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Info */}
                                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                        <p className="text-gray-700 text-sm">
                                            <span className="font-semibold text-orange-600">{selectedShoe.stockRemaining} pairs</span> currently in stock at {selectedShoe.store.store_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <p className="text-gray-600 text-sm mb-3">Contact {selectedShoe.store.store_name} to purchase:</p>
                                    <button
                                        onClick={() => handleContact('phone', selectedShoe.store.phone)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-md hover:from-orange-600 hover:to-red-600 transition-colors duration-150"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call {selectedShoe.store.phone}
                                    </button>
                                    <button
                                        onClick={() => handleContact('whatsapp', selectedShoe.store.phoneNumber)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-150"
                                    >
                                        <ChatBubbleIcon className="w-4 h-4" />
                                        Message on WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}