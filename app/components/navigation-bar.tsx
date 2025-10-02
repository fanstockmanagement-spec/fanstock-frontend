"use client";

import { TriangleLeftIcon, TriangleRightIcon, PersonIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

export function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show navbar when at top
            if (currentScrollY < 10) {
                setIsVisible(true);
            }
            // Hide when scrolling down, show when scrolling up
            else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navlinks = [
        { href: "/", label: "Home" },
        { href: "/new-releases", label: "New Releases" },
        { href: "/featured-stores", label: "Featured-Stores" },
        { href: "/contact", label: "Contact" }
    ];

    return (
        <nav className={`flex justify-between items-center px-4 md:px-8 lg:px-16 xl:px-24 w-full h-16 bg-gradient-to-r from-orange-500/30 via-pink-500/30 to-orange-400/30 backdrop-blur-lg fixed z-50 text-sm border-b border-orange-300/40 shadow-lg transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            {/* logo */}
            <a href="/" className="text-white font-bold text-lg md:text-xl lg:text-2xl tracking-wider z-50">
                FANSTOCK
            </a>

            {/* Desktop navlink */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-10 uppercase">
                {navlinks.map((link) => (
                    <a 
                        href={link.href}
                        key={link.href}
                        className="relative text-[11px] xl:text-[12px] pb-1 text-white group transition-all duration-150 translate-y-1 hover:translate-y-0 font-medium"
                    >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </a>
                ))}
            </div>

            {/* Desktop Account */}
            <a href="/sign-in" className="hidden lg:flex bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 px-6 xl:p-3 xl:px-10 items-center gap-2 hover:from-pink-500 hover:to-orange-500 transition-all duration-300 font-medium text-xs xl:text-sm">
                <PersonIcon />
                Account
            </a>

            {/* Mobile menu button */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white z-50"
            >
                {isMenuOpen ? <Cross1Icon className="w-6 h-6" /> : <HamburgerMenuIcon className="w-6 h-6" />}
            </button>

            {/* Mobile menu - Fixed with better contrast */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-40 pt-20">
                    <div className="flex flex-col bg-black/95 backdrop-blur-xl items-center gap-6 p-8">
                        {navlinks.map((link) => (
                            <a 
                                href={link.href}
                                key={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-white text-xl font-semibold uppercase hover:scale-110 transition-transform duration-200 px-6 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm border border-orange-300/30 w-full text-center"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a 
                            href="/sign-in"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 px-12 flex items-center justify-center gap-3 font-bold text-base mt-4 hover:scale-105 transition-transform duration-200 w-full"
                        >
                            <PersonIcon className="w-5 h-5" />
                            Account
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}