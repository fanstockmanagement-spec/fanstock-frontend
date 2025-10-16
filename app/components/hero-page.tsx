// "use client";

// import { TrendingUp } from 'lucide-react';
// import Image from 'next/image';
// import React from 'react';

// export default function HeroPage() {

//     return (
//         <section className="pt-[15rem] pb-12 bg-black sm:pb-16 lg:pb-20 xl:pb-24 text-sm">
//             <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
//                 <div className="relative">
//                     <div className="lg:w-2/3">
//                         <p className="text-sm font-normal tracking-widest text-gray-300 uppercase">A Room for Sellers and Their Stocks</p>
//                         <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl"><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Unlimited Stock</span> Accessibility</h1>
//                         <p className="max-w-lg mt-4 font-normal text-gray-400 sm:mt-8">Have been wondering where to find the stock you need? Look no further. FanStock is here to help you find the stock you need.</p>
//                         <button className="px-6 py-3 mt-10 text-white bg-gradient-to-r from-orange-500 to-red-500 border border-orange-500 rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"> Start Exploring Stock </button>

//                         <div>
//                             <div className="inline-flex items-center pt-6 mt-8 border-t border-gray-800 sm:pt-10 sm:mt-14">
//                                 <TrendingUp color='orange' strokeWidth={1.5} />
//                                 <span className="ml-2 text-base font-normal text-white"> 42 new stock was added last week </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8 md:absolute md:mt-0 md:top-32 lg:top-0 md:right-0">
//                         <Image src="/hero-image.png" alt="hero image" width={500} height={500} />
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// } 


"use client";
import { TrendingUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function HeroPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    
    // Add your shoe image URLs here - use PNG images with transparent backgrounds
    // For 360 view, add multiple angles of the same shoe or use your own product images
    const shoeImages = [
        "vecteezy_colorful-cool-running-sneakers-mockup-vibrant-colors_47758796 (1).png", 
    ];

    // Combined rotation and image change effect
    useEffect(() => {
        const rotateInterval = setInterval(() => {
            setRotation(prev => {
                const newRotation = prev + 2;
                // Change image when completing 360 degree rotation
                if (newRotation >= 360) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % shoeImages.length);
                    return 0;
                }
                return newRotation;
            });
        }, 20);

        return () => clearInterval(rotateInterval);
    }, [shoeImages.length]);

    return (
        <section className="pt-[8rem] md:pt-[15rem] pb-12 bg-black sm:pb-16 lg:pb-20 xl:pb-24 text-sm overflow-hidden">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="relative">
                    {/* 3D Rotating Image Container - Shows First on Mobile */}
                    <div className="mb-8 md:mb-0 md:absolute md:mt-0 md:top-32 lg:top-0 md:right-0 flex justify-center md:justify-end">
                        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] perspective-1000">
                            {/* 3D Container */}
                            <div 
                                className="relative w-full h-full transition-transform duration-300"
                                style={{
                                    transform: `rotateY(${rotation}deg)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {/* Main Image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img 
                                        src={shoeImages[currentIndex]} 
                                        alt={`Shoe ${currentIndex + 1}`}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                        style={{
                                            transform: 'translateZ(50px)',
                                            filter: 'drop-shadow(0 25px 50px rgba(249, 115, 22, 0.3))'
                                        }}
                                    />
                                </div>
                                
                                {/* Glow Effect */}
                                <div 
                                    className="absolute"
                                    style={{ transform: 'translateZ(-50px)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Text Content - Shows Second on Mobile */}
                    <div className="lg:w-2/3">
                        <p className="text-sm font-normal tracking-widest text-gray-300 uppercase">A Room for Sellers and Their Stocks</p>
                        <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Unlimited Stock</span> Accessibility
                        </h1>
                        <p className="max-w-lg mt-4 font-normal text-gray-400 sm:mt-8">
                            Have been wondering where to find the stock you need? Look no further. FanStock is here to help you find the stock you need.
                        </p>
                        <button className="px-6 py-3 mt-10 text-white bg-gradient-to-r from-orange-500 to-red-500 border border-orange-500 rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium">
                            Start Exploring Stock
                        </button>
                        
                        <div>
                            <div className="inline-flex items-center pt-6 mt-8 border-t border-gray-800 sm:pt-10 sm:mt-14">
                                <TrendingUp color='orange' strokeWidth={1.5} />
                                <span className="ml-2 text-base font-normal text-white"> 42 new stock was added last week </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
}