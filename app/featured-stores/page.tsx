"use client";

import { useState } from 'react';
import { StarFilledIcon, MobileIcon, ChatBubbleIcon, EyeOpenIcon, Cross2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function FeatureStores() {
    const [selectedShoe, setSelectedShoe] = useState(null);

    // Mock data - Replace with actual API calls
    const featuredStores = [
        {
            store_id: 1,
            store_name: "Urban Kicks Rwanda",
            owner_name: "Jean Baptiste",
            location: "Kigali, Kimironko",
            phone: "+250788123456",
            whatsapp: "+250788123456",
            featuredSubscription: true,
            rating: 4.8,
            totalShoes: 45,
            featured_shoes: [
                {
                    shoe_id: "9fc8746f-44c0-474c-9629-cd8a34c44e04",
                    brand: "Puma",
                    model_name: "Suede Classic",
                    category: "Unisex",
                    stockRemaining: 12,
                    colors: ["Black", "Navy", "Red", "Green"],
                    sizes: ["38", "39", "40", "41", "42", "43", "44"],
                    price_retail: "79.99",
                    description: "Iconic Puma Suede with timeless style and comfort.",
                    image_urls: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"]
                },
                {
                    shoe_id: "bbfd3990-2993-4217-a1de-8b789e5e3725",
                    brand: "Nike",
                    model_name: "Jordan 1 Retro High",
                    category: "Sports",
                    stockRemaining: 8,
                    colors: ["Chicago", "Bred", "Royal Blue"],
                    sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
                    price_retail: "179.99",
                    description: "Legendary Air Jordan 1 with premium leather construction.",
                    image_urls: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500"]
                }
            ]
        },
        {
            store_id: 2,
            store_name: "Sneaker Paradise",
            owner_name: "Marie Claire",
            location: "Kigali, Remera",
            phone: "+250788987654",
            whatsapp: "+250788987654",
            featuredSubscription: true,
            rating: 4.9,
            totalShoes: 67,
            featured_shoes: [
                {
                    shoe_id: "abc123",
                    brand: "Adidas",
                    model_name: "Yeezy Boost 350",
                    category: "Lifestyle",
                    stockRemaining: 5,
                    colors: ["Cream White", "Core Black"],
                    sizes: ["40", "41", "42", "43", "44"],
                    price_retail: "220.00",
                    description: "Limited edition Yeezy Boost with premium knit upper.",
                    image_urls: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]
                }
            ]
        }
    ];

    const handleContact = (type: string, contact: string) => {
        if (type === 'phone') {
            window.location.href = `tel:${contact}`;
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/${contact.replace(/\+/g, '')}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <StarFilledIcon className="w-8 h-8 text-orange-400" />
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        Featured Stores
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Browse premium shoe retailers in your area. Contact them directly to check availability and visit their stores.
                </p>
            </div>

            {/* Stores Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
                {featuredStores.map((store) => (
                    <div key={store.store_id} className="relative">
                        {/* Store Header Card */}
                        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                                            {store.store_name}
                                        </h2>
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xs font-bold rounded-full">
                                            FEATURED
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-300 mb-2">Owner: {store.owner_name}</p>
                                    <p className="text-gray-400 text-sm mb-3">📍 {store.location}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-orange-400">⭐ {store.rating}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-400">{store.totalShoes} shoes in stock</span>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={() => handleContact('phone', store.phone)}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 hover:scale-105"
                                    >
                                        <MobileIcon className="w-5 h-5" />
                                        Call Now
                                    </button>
                                    <button 
                                        onClick={() => handleContact('whatsapp', store.whatsapp)}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
                                    >
                                        <ChatBubbleIcon className="w-5 h-5" />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Shoes Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {store.featured_shoes.map((shoe) => (
                                <div 
                                    key={shoe.shoe_id}
                                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                                    onClick={() => setSelectedShoe({ ...shoe, store })}
                                >
                                    {/* Shoe Image */}
                                    <div className="relative h-64 overflow-hidden bg-gray-800">
                                        <img 
                                            src={shoe.image_urls[0]} 
                                            alt={`${shoe.brand} ${shoe.model_name}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                                            ${shoe.price_retail}
                                        </div>
                                        {shoe.stockRemaining < 10 && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-cyan-500 rounded-full text-white text-xs font-bold">
                                                Only {shoe.stockRemaining} left
                                            </div>
                                        )}
                                    </div>

                                    {/* Shoe Info */}
                                    <div className="p-5">
                                        <p className="text-orange-400 text-sm font-semibold mb-1">{shoe.brand}</p>
                                        <h3 className="text-white text-lg font-bold mb-2">{shoe.model_name}</h3>
                                        <p className="text-gray-400 text-sm mb-3">{shoe.category}</p>

                                        {/* Quick Info */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                            <span>{shoe.colors.length} colors</span>
                                            <span>•</span>
                                            <span>{shoe.sizes.length} sizes</span>
                                        </div>

                                        <button className="w-full py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-orange-400 font-semibold rounded-lg hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                                            <EyeOpenIcon />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Shoe Detail Modal */}
            {selectedShoe && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl max-w-4xl w-full my-8 overflow-hidden relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedShoe(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 z-10"
                        >
                            <Cross2Icon className="w-6 h-6" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-8 p-8">
                            {/* Image Section */}
                            <div className="space-y-4">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                                    <img 
                                        src={selectedShoe.image_urls[0]} 
                                        alt={`${selectedShoe.brand} ${selectedShoe.model_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {selectedShoe.image_urls.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedShoe.image_urls.map((url, idx) => (
                                            <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:opacity-75 transition-opacity">
                                                <Image src={url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col">
                                <div className="flex-1">
                                    <p className="text-orange-400 font-semibold mb-2">{selectedShoe.brand}</p>
                                    <h2 className="text-3xl font-bold text-white mb-4">{selectedShoe.model_name}</h2>
                                    <div className="text-2xl font-bold text-orange-400 mb-4">${selectedShoe.price_retail}</div>
                                    
                                    <p className="text-gray-300 leading-relaxed mb-6">{selectedShoe.description}</p>

                                    {/* Colors */}
                                    <div className="mb-6">
                                        <p className="text-white font-semibold mb-3">Available Colors:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedShoe.colors.map((color, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-white rounded-full text-sm">
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-6">
                                        <p className="text-white font-semibold mb-3">Available Sizes:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedShoe.sizes.map((size, idx) => (
                                                <span key={idx} className="w-12 h-12 bg-white/5 border border-white/20 text-white rounded-lg text-sm flex items-center justify-center hover:bg-cyan-500/20 hover:border-orange-500/50 transition-all">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Info */}
                                    <div className="mb-6 p-4 bg-cyan-500/10 border border-orange-500/30 rounded-lg">
                                        <p className="text-gray-300 text-sm">
                                            <span className="font-semibold text-orange-400">{selectedShoe.stockRemaining} pairs</span> currently in stock at {selectedShoe.store.store_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <p className="text-gray-400 text-sm mb-3">Contact {selectedShoe.store.store_name} to purchase:</p>
                                    <button 
                                        onClick={() => handleContact('phone', selectedShoe.store.phone)}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
                                    >
                                        <MobileIcon className="w-5 h-5" />
                                        Call {selectedShoe.store.phone}
                                    </button>
                                    <button 
                                        onClick={() => handleContact('whatsapp', selectedShoe.store.whatsapp)}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
                                    >
                                        <ChatBubbleIcon className="w-5 h-5" />
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