"use client";

import Image from "next/image";

interface Logo {
  name: string;
  src: string;
}

const logos: Logo[] = [
  { name: "Nike", src: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png" },
  { name: "Adidas", src: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png" },
  { name: "Jordan", src: "https://logos-world.net/wp-content/uploads/2020/04/Jordan-Logo.png" },
  { name: "Puma", src: "https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png" },
  { name: "New Balance", src: "https://logos-world.net/wp-content/uploads/2020/04/New-Balance-Logo.png" },
  { name: "Converse", src: "https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png" },
  { name: "Vans", src: "https://logos-world.net/wp-content/uploads/2020/04/Vans-Logo.png" },
  { name: "Reebok", src: "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo.png" },
];

export default function LogoScroll() {

  return (
    <div className="relative w-full h-32 overflow-hidden logo-scroll-container">
      {/* Continuous scrolling logos */}
      <div className="absolute inset-0 flex items-center">
        {/* First set of logos */}
        <div className="flex items-center space-x-16 animate-scroll">
          {logos.map((logo, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 w-28 h-20 flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                className="max-w-full max-h-full object-contain transition-all duration-500 hover:scale-110"
                loading="lazy"
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
        {/* Second set of logos for seamless loop */}
        <div className="flex items-center space-x-16 animate-scroll">
          {logos.map((logo, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 w-28 h-20 flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                className="max-w-full max-h-full object-contain transition-all duration-500 hover:scale-110"
                loading="lazy"
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left gradient overlay */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      
      {/* Right gradient overlay */}
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
