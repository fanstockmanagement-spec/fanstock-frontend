"use client";

import { TriangleLeftIcon, TriangleRightIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

export default function HeroPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const slides = [
        {
            title: "Transform Your Shoe Retail Business",
            subtitle: "Smart Inventory Management",
            description: "Say goodbye to manual bookkeeping. FanStock brings your shoe store into the digital age with real-time inventory tracking, online storefront, and powerful analytics.",
            image: "close-up-futuristic-sneakers-showcase.jpg",
            cta1: "Start Free Trial",
            cta2: "Watch Demo"
        },
        {
            title: "Never Lose Track Again",
            subtitle: "Cloud-Based & Secure",
            description: "No more lost books or damaged records. Your inventory data is safely stored in the cloud with automatic backups. Access your store information anytime, anywhere.",
            image: "close-up-futuristic-sneakers-showcase.jpg",
            cta1: "See Features",
            cta2: "Learn More"
        },
        {
            title: "Get Customers Online",
            subtitle: "Public Storefront Included",
            description: "Let customers browse your available shoes and sizes online. Increase visibility, reduce phone calls, and attract digital-first shoppers with your own online presence.",
            image: "close-up-futuristic-sneakers-showcase.jpg",
            cta1: "View Plans",
            cta2: "Contact Sales"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
    }, [currentSlide]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];

    return (
        <div className="relative w-full overflow-hidden">
            <div 
                className="relative h-screen w-full pt-16" 
                style={{ 
                    backgroundImage: `url(close-up-futuristic-sneakers-showcase.jpg)`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex items-center px-4 md:px-8 lg:px-16 xl:px-24 py-8">
                    <div className="text-start text-white max-w-7xl w-full">
                        {/* Subtitle badge */}
                        <div 
                            key={`subtitle-${currentSlide}`}
                            className={`inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-orange-500/30 to-pink-500/30 backdrop-blur-md rounded-full text-xs md:text-sm mb-4 md:mb-6 border border-orange-300/30 transition-all duration-600 ${
                                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            {slide.subtitle}
                        </div>

                        {/* Main title */}
                        <h1 
                            key={`title-${currentSlide}`}
                            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 max-w-4xl bg-gradient-to-r from-white via-orange-100 to-pink-100 bg-clip-text text-transparent transition-all duration-600 delay-100 ${
                                isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            {slide.title}
                        </h1>

                        {/* Description */}
                        <p 
                            key={`description-${currentSlide}`}
                            className={`text-gray-200 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl leading-relaxed transition-all duration-600 delay-200 ${
                                isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            {slide.description}
                        </p>

                        {/* CTA Buttons */}
                        <div 
                            key={`cta-${currentSlide}`}
                            className={`flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-16 transition-all duration-600 delay-300 ${
                                isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            <button className="px-6 py-2.5 md:px-8 md:py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-medium text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105">
                                {slide.cta1}
                                <TriangleRightIcon />
                            </button>
                            <button className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-white/50 backdrop-blur-sm text-white hover:bg-white hover:text-orange-500 transition-all duration-300 font-medium text-sm md:text-base hover:scale-105">
                                {slide.cta2}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
                            <div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">10,000+</div>
                                <div className="text-xs md:text-sm text-gray-300 mt-1">Retailers Targeted</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">$5</div>
                                <div className="text-xs md:text-sm text-gray-300 mt-1">Starting Price</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">99.9%</div>
                                <div className="text-xs md:text-sm text-gray-300 mt-1">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 w-8 md:w-10' 
                                    : 'bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}