import { ChartBar, Globe, Lightbulb, Lock } from "lucide-react";

export default function ProblemsSection() {
    const problems = [
        {
            icon: <ChartBar size={16} strokeWidth={1.5} />,
            title: "Still Using Physical Books?",
            description: "You're not alone. Most shoe retailers spend hours every week updating handwritten records, checking stock levels, and manually tracking sales. It's exhausting, and one coffee spill could wipe out months of data.",
            stat: "4+ hours",
            statLabel: "wasted weekly"
        },
        {
            icon: <Lock size={16} strokeWidth={1.5} />,
            title: "One Flood Away From Disaster",
            description: "Your entire business history lives in those books. What happens when they get damaged, stolen, or simply misplaced? We've heard too many stories of retailers losing everything overnight.",
            stat: "68%",
            statLabel: "have lost records"
        },
        {
            icon: <Lightbulb size={16} strokeWidth={1.5} />,
            title: "Customers Leaving Empty-Handed",
            description: "You thought you had that size 9 in stock. The customer is standing right there. But after checking... it's not there. These moments hurt your reputation and cost you sales.",
            stat: "23%",
            statLabel: "lost sales from errors"
        },
        {
            icon: <Globe size={16} strokeWidth={1.5} />,
            title: "Invisible to Online Shoppers",
            description: "Today's customers Google before they visit. If they can't see what you have in stock online, they'll just go to a competitor who has a website. You're losing customers before they even know you exist.",
            stat: "89%",
            statLabel: "check online first"
        }
    ];

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    width: '100%',
                    height: '100%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-gray-900/90 to-black/85"></div>
            </div>

            <div className="relative z-10 w-full h-full">
                {/* Header */}
                <div className="mb-16 md:mb-20 mx-auto max-w-6xl px-4">
                    <p className="text-orange-400 font-medium mb-3 text-sm uppercase tracking-wider">
                        The Reality Check
                    </p>
                    <h2 className="text-4xl md:text-6xl  text-white mb-6 max-w-3xl">
                        Running a shoe store shouldn&apos;t feel like this
                    </h2>
                    <p className="text-gray-300 max-w-2xl leading-relaxed">
                        These aren&apos;t just problems—they&apos;re daily frustrations that hold your business back.
                    </p>
                </div>

                {/* Problems Grid */}
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-500 h-full"
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative">
                                {/* Icon and Title Row */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-orange-500 bg-orange-500/10 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                                        {problem.icon}
                                    </div>
                                    <h3 className="text-xl md:text-xl text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                                        {problem.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {problem.description}
                                </p>

                                {/* Stat Badge */}
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs">
                                    <span className="font-bold text-orange-400">
                                        {problem.stat}
                                    </span>
                                    <span className="text-gray-400">
                                        {problem.statLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center w-full">
                    <p className="text-gray-300 mb-6">
                        Sound familiar? It&apos;s time for a change.
                    </p>
                    <button className="px-8 py-3 bg-orange-500 text-white hover:bg-orange-400 rounded-full transition-colors cursor-pointer duration-300">
                        See How FanStock Solves This
                    </button>
                </div>
            </div>
        </section>
    );
}