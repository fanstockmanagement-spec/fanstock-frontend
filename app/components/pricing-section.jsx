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
            <div className="max-w-[92%] mx-auto px-4 md:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your business. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105 ${
                                plan.highlighted 
                                    ? 'bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 border-2 border-orange-400/50 shadow-xl shadow-orange-500/20' 
                                    : 'bg-gradient-to-br from-gray-900 to-black border border-orange-300/20'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            
                            <div className="text-center mb-6">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="mb-2">
                                    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-1">
                                        {plan.period}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckIcon className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                           
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}