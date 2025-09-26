"use client";

import React from 'react';

interface SlideInAnimationProps {
    children: React.ReactNode;
    isAnimating: boolean;
    delay?: number;
    translateY?: string;
    className?: string;
}

export default function SlideInAnimation({ 
    children, 
    isAnimating, 
    delay = 0, 
    translateY = 'translate-y-4',
    className = '' 
}: SlideInAnimationProps) {
    return (
        <div 
            className={`transition-all duration-600 ease-out ${className} ${
                isAnimating 
                    ? `opacity-0 ${translateY}` 
                    : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
