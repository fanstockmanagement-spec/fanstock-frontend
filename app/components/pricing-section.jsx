import { CheckIcon } from "@radix-ui/react-icons";

export default function PricingSection() {
    const plans = [
        {
            name: "Basic",
            price: "$5",
            period: "/month",
            description: "Perfect for small shops getting started",
            features: [
                "Core inventory management",
                "Stock tracking",
                "Size-specific inventory",
                "Basic reporting",
                "Cloud storage"
            ],
            highlighted: false
        },
        {
            name: "Premium",
            price: "$15",
            period: "/month",
            description: "For growing businesses that need more",
            features: [
                "Everything in Basic",
                "Advanced analytics",
                "Multiple staff accounts",
                "Priority support",
                "Export data"
            ],
            highlighted: true
        },
        {
            name: "Featured Storefront",
            price: "$20",
            period: "/month addon",
            description: "Boost your online visibility",
            features: [
                "Public product showcase",
                "Contact integration",
                "Premium placement",
                "Featured listing",
                "SEO optimization"
            ],
            highlighted: false
        }
    ];

    return (
        <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
            <div className="mx-auto max-w-7xl px-4 ">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto">
                        Choose the plan that fits your business. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`group relative bg-white/5 backdrop-blur-md rounded-lg border transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 ${
                                plan.highlighted 
                                    ? 'border-orange-400/50 bg-white/8' 
                                    : 'border-gray-700/50 hover:border-orange-500/30'
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-6 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            
                            {/* Card Content */}
                            <div className={`relative p-8 rounded-2xl ${plan.highlighted ? 'pt-10' : ''}`}>
                                
                                {/* Header Section */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                                        {plan.name}
                                    </h3>
                                    
                                    {/* Pricing */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-5xl  text-white">
                                                {plan.price}
                                            </span>
                                            <span className="text-gray-400 text-lg font-medium">
                                                {plan.period}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 group/feature">
                                            <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mt-0.5 group-hover/feature:bg-green-500/30 transition-colors duration-300">
                                                <CheckIcon className="w-4 h-4 text-green-400" />
                                            </div>
                                            <span className="text-gray-300 text-sm leading-rel axed group-hover/feature:text-gray-200 transition-colors duration-300">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button 
                                    className={`w-full py-3 px-6 rounded-full cursor-pointer text-sm transition-all duration-300 ${
                                        plan.highlighted
                                            ? 'bg-orange-500 text-white hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30'
                                            : 'bg-white/10 text-gray-300 border border-gray-600 hover:bg-white/20 hover:border-orange-400 hover:text-white'
                                    }`}
                                >
                                    {plan.highlighted ? 'Start Premium' : 'Choose Plan'}
                                </button>

                                {/* Subtle Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}