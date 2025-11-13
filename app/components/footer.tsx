import { EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    const footerLinks = {
        product: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Demo", href: "/contact-us" },
            // { label: "Integrations", href: "#integrations" },
            // { label: "Updates", href: "#updates" }
        ],
        resources: [
            { label: "Documentation", href: "#docs" },
            { label: "Guides", href: "#guides" },
            { label: "API Status", href: "#status" },
            { label: "Help Center", href: "#help" },
            { label: "Community", href: "#community" }
        ],
        company: [
            // { label: "About Us", href: "#about" },
            // { label: "Careers", href: "#careers" },
            // { label: "Blog", href: "#blog" },
            { label: "Press", href: "/press" },
            { label: "Partners", href: "/partners" }
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Cookie Policy", href: "/cookies-policy" },
        ]
    };

    const socialLinks = [
        { icon: <TwitterLogoIcon className="w-5 h-5" />, href: "#twitter", label: "Twitter" },
        { icon: <GitHubLogoIcon className="w-5 h-5" />, href: "#github", label: "GitHub" },
        { icon: <LinkedInLogoIcon className="w-5 h-5" />, href: "#linkedin", label: "LinkedIn" },
        { icon: <EnvelopeClosedIcon className="w-5 h-5" />, href: "mailto:fanstockmanagement@gmail.com", label: "Email" }
    ];

    return (
        <footer className="bg-black border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                FANSTOCK
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            Empowering shoe retailers with intelligent inventory management solutions that drive growth and efficiency.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="text-gray-400 hover:text-orange-400 transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 text-sm hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
{/* 
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 text-sm hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 text-sm hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 text-sm hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {currentYear} FanStock Technologies, Inc. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="#privacy" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">
                                Terms of Service
                            </a>
                            <a href="#cookies" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">
                                Cookie Settings
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
