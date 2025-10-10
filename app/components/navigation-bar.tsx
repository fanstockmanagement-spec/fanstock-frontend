"use client";

import React, { useState, useEffect } from 'react';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Featured Stores", href: "/featured-stores" },
        { label: "Pricing", href: "#pricing" },
        { label: "Support", href: "#support" },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle smooth scrolling for anchor links
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                setIsMenuOpen(false); // Close mobile menu after clicking
            }
        }
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && !(event.target as Element).closest('header')) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <header className={`py-4 sm:py-6 text-sm fixed w-full top-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-black/95 backdrop-blur-md border-b border-gray-800/50' 
                : 'bg-black'
        }`}>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="shrink-0">
                        <Link href="/" title="" className="text-white text-2xl font-semibold hover:text-orange-400 transition-colors duration-200">
                            FanStock
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button 
                            type="button" 
                            className="text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <HamburgerMenuIcon 
                                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                                        isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                                    }`} 
                                />
                                <Cross1Icon 
                                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                                        isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                                    }`} 
                                />
                            </div>
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden ml-10 mr-auto space-x-8 lg:ml-20 lg:space-x-12 md:flex md:items-center md:justify-start">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.label} 
                                href={link.href} 
                                title="" 
                                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-orange-400 relative group"
                                onClick={(e) => handleSmoothScroll(e, link.href)}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA button */}
                    <Link 
                        href="/sign-in" 
                        className='hidden md:inline-flex px-6 py-3 rounded-full text-white cursor-pointer border border-orange-500 hover:bg-orange-500 hover:border-orange-500 transition-all duration-200 font-medium'
                    >
                        Go to Account
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
                isMenuOpen 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                <nav className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((link, index) => (
                            <Link 
                                key={link.label} 
                                href={link.href} 
                                title="" 
                                className="block text-base font-normal text-gray-400 transition-all duration-200  hover:text-orange-400 py-2 px-4 rounded-lg hover:bg-gray-800/50"
                                onClick={(e) => handleSmoothScroll(e, link.href)}
                                style={{ 
                                    animationDelay: `${index * 100}ms`,
                                    animation: isMenuOpen ? 'slideInFromTop 0.3s ease-out forwards' : 'none'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        <div className="pt-4 border-t border-gray-800/50">
                            <Link 
                                href="/sign-in" 
                                className='block w-full text-center px-6 py-3 rounded-full text-white cursor-pointer border border-orange-500 hover:bg-orange-500 hover:border-orange-500 transition-all duration-200 font-medium'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Go to Account
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            <style jsx>{`
                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </header>
    );
}