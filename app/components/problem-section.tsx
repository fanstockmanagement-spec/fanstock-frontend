import { BarChartIcon, GlobeIcon, LightningBoltIcon, LockClosedIcon } from "@radix-ui/react-icons";

export default function ProblemsSection() {
    const problems = [
        {
            icon: <BarChartIcon className="w-6 h-6" />,
            title: "Still Using Physical Books?",
            description: "You're not alone. Most shoe retailers spend hours every week updating handwritten records, checking stock levels, and manually tracking sales. It's exhausting, and one coffee spill could wipe out months of data.",
            stat: "4+ hours",
            statLabel: "wasted weekly"
        },
        {
            icon: <LockClosedIcon className="w-6 h-6" />,
            title: "One Flood Away From Disaster",
            description: "Your entire business history lives in those books. What happens when they get damaged, stolen, or simply misplaced? We've heard too many stories of retailers losing everything overnight.",
            stat: "68%",
            statLabel: "have lost records"
        },
        {
            icon: <LightningBoltIcon className="w-6 h-6" />,
            title: "Customers Leaving Empty-Handed",
            description: "You thought you had that size 9 in stock. The customer is standing right there. But after checking... it's not there. These moments hurt your reputation and cost you sales.",
            stat: "23%",
            statLabel: "lost sales from errors"
        },
        {
            icon: <GlobeIcon className="w-6 h-6" />,
            title: "Invisible to Online Shoppers",
            description: "Today's customers Google before they visit. If they can't see what you have in stock online, they'll just go to a competitor who has a website. You're losing customers before they even know you exist.",
            stat: "89%",
            statLabel: "check online first"
        }
    ];

    return (
        <section className="relative py-20 md:py-32 ">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-gray-900/90 to-black/85"></div>
            </div>

            <div className="relative z-10 max-w-[92%] overflow-x-hidden mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-16 md:mb-20">
                    <p className="text-orange-400 font-medium mb-3 text-sm uppercase tracking-wider">
                        The Reality Check
                    </p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl">
                        Running a shoe store shouldn't feel like this
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                        These aren't just problems—they're daily frustrations that hold your business back.
                    </p>
                </div>

                {/* Problems Grid */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {problems.map((problem, index) => (
                        <div 
                            key={index}
                            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-500"
                        >
                            {/* Decorative gradient corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative">
                                {/* Icon and Title Row */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
                                        {problem.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                                            {problem.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {problem.description}
                                </p>

                                {/* Stat Badge */}
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-full">
                                    <span className="text-2xl font-bold text-orange-400">
                                        {problem.stat}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {problem.statLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <p className="text-gray-300 text-lg mb-6">
                        Sound familiar? It's time for a change.
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        See How FanStock Solves This
                    </button>
                </div>
            </div>
        </section>
    );
}