import Image from "next/image";

export default function ShoeCard() {
    return (
        <div className="group bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                    src="/wallpaper.jpg"
                    alt="Nike Air Max 270"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Nike
                </p>

                {/* Shoe Name */}
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#CA425A] transition-colors duration-200">
                    Air Jordan 1 Light Smoke Grey & Blue
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        $150
                    </span>
                </div>
            </div>
        </div>
    );
}