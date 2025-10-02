import { GlobeIcon, RocketIcon } from "@radix-ui/react-icons";

export default function Footer() {
    const footerLinks = {
        product: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Demo", href: "#demo" }
        ],
        company: [
            { label: "About Us", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Careers", href: "#careers" }
        ],
        legal: [
            { label: "Privacy Policy", href: "#privacy" },
            { label: "Terms of Service", href: "#terms" },
            { label: "Cookie Policy", href: "#cookies" }
        ]
    };

    return (
        <footer id="contact" className="bg-black border-t border-orange-300/20">
            <div className="max-w-[92%] mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            FANSTOCK
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Transforming shoe retail through smart inventory management.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-300/30 rounded-lg flex items-center justify-center hover:border-orange-400/50 transition-all">
                                <GlobeIcon className="w-5 h-5 text-orange-400" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-300/30 rounded-lg flex items-center justify-center hover:border-orange-400/50 transition-all">
                                <RocketIcon className="w-5 h-5 text-orange-400" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-orange-300/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 FanStock. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Built with ❤️ for shoe retailers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
