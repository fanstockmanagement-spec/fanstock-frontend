"use client";

import React, { useState } from 'react';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { label: "Products", href: "#products" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Support", href: "#support" },
    ];

    return (
        <header className="py-4 bg-black sm:py-6 text-sm fixed w-full top-0 z-50">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="shrink-0">
                        <Link href="#" title="" className="text-white text-2xl font-semibold">
                            FanStock                        </Link>
                    </div>

                    <div className="flex md:hidden">
                        <button type="button" className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}>
                            {!isMenuOpen ? (
                                <HamburgerMenuIcon className="w-7 h-7" />
                            ) : (
                                <Cross1Icon className="w-7 h-7" />
                            )}
                        </button>
                    </div>

                    <nav className="hidden ml-10 mr-auto space-x-10 lg:ml-20 lg:space-x-12 md:flex md:items-center md:justify-start">
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} title="" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> {link.label} </Link>
                        ))}

                    </nav>

                    <Link href="/sign-in" className='px-6 py-3 rounded-full text-white cursor-pointer border border-orange-500'>Go to Account</Link>

                </div>
            </div>

            {isMenuOpen && (
                <nav className="block md:hidden">
                    <div className="flex flex-col pt-8 pb-4 space-y-6">
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} title="" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> {link.label} </Link>
                        ))}

                        <Link href="/sign-in" className='px-6 py-3 rounded-full cursor-pointer border border-orange-500'>Go to Account</Link>
                    </div>
                </nav>
            )}
        </header>
    );
}