import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import { ArrowRight, Mail, Handshake, Users, BarChart2, Zap } from "lucide-react";
import Link from "next/link";

const benefits = [
    {
        icon: <BarChart2 className="w-8 h-8 text-orange-500" />,
        title: "Grow Your Business",
        description: "Reach new customers and expand your market presence through our network."
    },
    {
        icon: <Zap className="w-8 h-8 text-orange-500" />,
        title: "Access to Technology",
        description: "Leverage our cutting-edge inventory management platform for your business needs."
    },
    {
        icon: <Users className="w-8 h-8 text-orange-500" />,
        title: "Join a Community",
        description: "Connect with other industry leaders and like-minded professionals."
    }
];

const partnershipTypes = [
    {
        title: "Reseller Partners",
        description: "Become an authorized reseller of FanStock solutions and earn competitive commissions.",
        cta: "Become a Reseller"
    },
    {
        title: "Technology Partners",
        description: "Integrate your technology with our platform to create powerful solutions.",
        cta: "Explore Integration"
    },
    {
        title: "Strategic Alliances",
        description: "Collaborate with us on joint marketing and business development initiatives.",
        cta: "Discuss Partnership"
    }
];

export default function Partners() {
    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 mt-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Partner With Us</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Join our partner ecosystem and grow your business with FanStock&rsquo;s innovative inventory management solutions.
                    </p>
                </div>
            </div>

            {/* Why Partner Section */}
            <div className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With FanStock?</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Our partners are essential to our success. We work closely with businesses that share our vision of transforming inventory management for shoe retailers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partnership Types */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            We offer various partnership models to suit different business needs and goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {partnershipTypes.map((type, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Handshake className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                                <p className="text-gray-600 mb-6">{type.description}</p>
                                <a 
                                    href="mailto:contact.fanstock@gmail.com" 
                                    className="text-orange-500 font-medium inline-flex items-center hover:underline"
                                >
                                    {type.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Partner With Us?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join our growing network of partners and help shape the future of inventory management.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a 
                            href="mailto:contact.fanstock@gmail.com" 
                            className="px-8 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                        >
                            <Mail className="w-5 h-5 mr-2" /> Email Us
                        </a>
                        <Link 
                            href="/contact-us" 
                            className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                        >
                            Contact Sales <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}