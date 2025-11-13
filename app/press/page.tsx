import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import { Newspaper, Clock, Mail } from "lucide-react";

export default function Press() {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Press & Media</h1>
                    <p className="text-xl opacity-90">
                        Our press center is coming soon. Check back later for updates!
                    </p>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                    <p className="text-gray-600 mb-8">
                        We&apo;re working hard to create a comprehensive press section with all the resources you need, 
                        including press releases, media assets, and company information.
                    </p>
                    
                    <div className="space-y-4 max-w-md mx-auto">
                        <p className="text-gray-700 font-medium">
                            For immediate press inquiries, please contact:
                        </p>
                        <a 
                            href="mailto:contact.fanstock@gmail.com" 
                            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            contact.fanstock@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}