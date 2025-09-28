"use client";

import { TriangleLeftIcon, TriangleRightIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';
import SlideInAnimation from './slide-in-animation';

export default function HeroPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const slides = [
        {
            title: "Step Into Style",
            subtitle: "Premium Collection 2025",
            image: "wallpaper.jpg",
            color: "from-purple-600 to-blue-600"
        },
        {
            title: "All Kinds of Kicks",
            subtitle: "Business & Formal Collection",
            image: "wallpaper.jpg",
            color: "from-gray-800 to-gray-600"
        },
        {
            title: "Athletic Performance",
            subtitle: "Sports & Running Series",
            image: "wallpaper.jpg",
            color: "from-orange-500 to-red-500"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Handle animation state when slide changes
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
    }, [currentSlide]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];

    return (
        <div className="relative h-screen overflow-hidden text-sm w-screen">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />

            <button onClick={prevSlide} className="absolute left-6 top-1/2 z-20 text-white border border-white cursor-pointer rounded-full p-3 hover:text-[#CA425A] transi duration-150">
                <TriangleLeftIcon />
            </button>

            <button onClick={nextSlide} className="absolute right-6 top-1/2 z-20 text-white border border-white cursor-pointer rounded-full p-3 hover:text-[#CA425A] transi duration-150">
                <TriangleRightIcon />
            </button>

            <div className="absolute inset-0 z-10 flex items-center justify-start px-6 md:px-32 w-full md:w-[70%]">
                <div className="text-start pl-10 text-white max-w-4xl">
                    <SlideInAnimation 
                        key={`subtitle-${currentSlide}`}
                        isAnimating={isAnimating}
                        className="inline-block px-6 py-2 bg-white/10 rounded-full text-sm mb-4"
                    >
                        {slide.subtitle}
                    </SlideInAnimation>

                    <SlideInAnimation 
                        key={`title-${currentSlide}`}
                        isAnimating={isAnimating}
                        translateY="translate-y-8"
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        {slide.title}
                    </SlideInAnimation>

                    <SlideInAnimation 
                        key={`description-${currentSlide}`}
                        isAnimating={isAnimating}
                        delay={100}
                        className="text-white text-sm mb-6"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor libero aperiam, autem eius, optio nam expedita iste velit fuga maiores nostrum dicta delectus laudantium voluptatum repellendus consectetur, rerum facere minima?
                    </SlideInAnimation>

                    <div className="flex flex-wrap gap-4 justify-start">
                        <button className="p-3 px-10 flex items-center gap-2 bg-[#CA425A] text-white hover:bg-[#CA425A]/90 cursor-pointer transition-colors duration-150">
                            Create Your Invetory
                            <TriangleRightIcon />
                        </button>
                        <button className="px-10 p-3 border border-white text-white hover:bg-white hover:text-[#CA425A] cursor-pointer transition-colors duration-150">
                            View Collection
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'border border-white'}`}
                    />
                ))}
            </div>
        </div>
    );
}