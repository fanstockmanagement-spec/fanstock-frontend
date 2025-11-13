import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-lg">Last updated: November 13, 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="prose prose-orange max-w-none">
                    <p className="text-gray-600 mb-8">
                        At FanStock, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                        use, disclose, and safeguard your information when you use our inventory management platform.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details.</li>
                                <li><strong>Business Information:</strong> Company name, business address, tax information, and payment details.</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with our platform, including IP addresses, browser type, and device information.</li>
                                <li><strong>Inventory Data:</strong> Product details, stock levels, sales data, and other inventory-related information.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li>Provide, operate, and maintain our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Improve, personalize, and expand our services</li>
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>Send you technical notices, updates, and security alerts</li>
                                <li>Monitor and analyze usage and trends to improve user experience</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information 
                                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                                over the Internet or electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Retention</h2>
                            <p className="text-gray-600 mb-4">
                                We retain your personal information only for as long as necessary to provide you with our services 
                                and as described in this Privacy Policy. However, we may also be required to retain this information 
                                to comply with legal and regulatory obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Data Protection Rights</h2>
                            <p className="text-gray-600 mb-4">
                                Depending on your location, you may have certain rights regarding your personal information, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li>The right to access, update, or delete your information</li>
                                <li>The right to rectification if your information is inaccurate or incomplete</li>
                                <li>The right to object to our processing of your personal data</li>
                                <li>The right to request restriction of processing your personal information</li>
                                <li>The right to data portability</li>
                            </ul>
                            <p className="text-gray-600">
                                To exercise any of these rights, please contact us using the information in the Contact Us section below.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
                            <p className="text-gray-600 mb-4">
                                We may employ third-party companies and individuals to facilitate our service, provide the service 
                                on our behalf, perform service-related services, or assist us in analyzing how our service is used. 
                                These third parties have access to your Personal Information only to perform these tasks on our 
                                behalf and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                Our service is not intended for individuals under the age of 18. We do not knowingly collect personally 
                                identifiable information from children under 18. If you are a parent or guardian and you are aware that 
                                your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                                Privacy Policy on this page and updating the Last updated date at the top of this Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li>By email: <a href="mailto:fanstockmanagement@gmail.com" className="text-orange-500 hover:underline">fanstockmanagement@gmail.com</a></li>
                                <li>By visiting our <Link href="/contact-us" className="text-orange-500 hover:underline inline-flex items-center">
                                    contact page <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Link></li>
                                <li>By mail: 123 Shoe Street, New York, NY 10001, United States</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}