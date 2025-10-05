import { BarChartIcon, GlobeIcon, RocketIcon, CheckCircledIcon } from "@radix-ui/react-icons";

export function FeaturesSection() {
    const features = [
        {
            icon: <BarChartIcon className="w-6 h-6" />,
            title: "Finally, Inventory That Makes Sense",
            description: "Remember that nightmare of flipping through pages trying to find if you have a size 8 in stock? Those days are over. Search any shoe, any size, instantly. Your inventory updates automatically as you sell, so you always know exactly what you have.",
            highlights: [
                "Search by brand, model, or size in seconds",
                "Automatic stock updates when you make a sale",
                "Low stock alerts so you never run out",
                "See your entire inventory at a glance"
            ]
        },
        {
            icon: <GlobeIcon className="w-6 h-6" />,
            title: "Your Store, Now Open 24/7 Online",
            description: "Customers can finally see what you have before they visit. No more 'Do you have this in my size?' phone calls at 9 PM. They browse your stock online, see what's available, and come in ready to buy. You get more foot traffic, they waste less time.",
            highlights: [
                "Showcase your full catalog with photos",
                "Customers see real-time availability",
                "Contact buttons for quick inquiries",
                "Works on all devices - phones, tablets, computers"
            ]
        },
        {
            icon: <RocketIcon className="w-6 h-6" />,
            title: "Know What's Actually Making You Money",
            description: "Which shoes sell fastest? What's your best month? These questions shouldn't require a calculator and hours of your time. Get clear charts showing your revenue trends, bestselling products, and exactly where your business is heading.",
            highlights: [
                "Daily, monthly, and yearly revenue reports",
                "See which shoes fly off the shelves",
                "Track seasonal trends and plan accordingly",
                "Export reports for your accountant"
            ]
        },
       
    ];

    return (
        <section id="features" className="relative py-20 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden w-full">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-[92%] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-16 md:mb-20">
                    <p className="text-orange-400 font-medium mb-3 text-sm uppercase tracking-wider">
                        The Complete Package
                    </p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl">
                        Built for shoe retailers, by people who get it
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Every feature solves a real problem you face every single day.
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-12 md:space-y-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                {/* Icon Side */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    {/* Highlights as checklist */}
                                    <div className="space-y-3">
                                        {feature.highlights.map((highlight, i) => (
                                            <div 
                                                key={i}
                                                className="flex items-start gap-3 text-gray-400"
                                            >
                                                <CheckCircledIcon className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm md:text-base">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Divider line between features (except last one) */}
                            {index < features.length - 1 && (
                                <div className="mt-12 md:mt-16 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 md:mt-20 text-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl backdrop-blur-sm">
                        <p className="text-white text-lg md:text-xl font-semibold">
                            Ready to see it in action?
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg">
                            Start Your Free Trial
                        </button>
                        <p className="text-gray-400 text-sm">No credit card required • Set up in 5 minutes</p>
                    </div>
                </div>
            </div>
        </section>
    );
}