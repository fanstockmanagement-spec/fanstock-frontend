import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 mt-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-lg">Last updated: November 13, 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="prose prose-orange max-w-none">
                    <p className="text-gray-600 mb-8">
                        Welcome to FanStock. By accessing or using our services, you agree to be bound by these Terms of Service.
                        Please read them carefully before using our platform.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing or using the FanStock platform, you agree to be bound by these Terms of Service, 
                                all applicable laws and regulations, and agree that you are responsible for compliance with any 
                                applicable local laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                            <p className="text-gray-600 mb-4">
                                FanStock provides an inventory management platform designed specifically for shoe retailers. 
                                Our service includes inventory tracking, sales management, and analytics tools to help businesses 
                                manage their operations more efficiently.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                            <p className="text-gray-600 mb-4">
                                To access certain features of the Service, you may be required to create an account. You agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li>Provide accurate, current, and complete information during registration</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                                <li>Notify us immediately of any unauthorized use of your account</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Billing</h2>
                            <p className="text-gray-600 mb-4">
                                Our service is offered on a subscription basis. By subscribing, you agree to pay all applicable fees.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                                <li>All fees are non-refundable except as required by law</li>
                                <li>We reserve the right to change our pricing with 30 days notice</li>
                                <li>Taxes are not included in the subscription fees</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Responsibilities</h2>
                            <p className="text-gray-600 mb-4">
                                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li>Use the Service in any way that violates any applicable law or regulation</li>
                                <li>Engage in any conduct that restricts or inhibits anyone&apos;s use of the Service</li>
                                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                                <li>Upload or transmit any viruses or other harmful code</li>
                                <li>Use the Service to store or transmit infringing or unlawful material</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-600 mb-4">
                                The Service and its original content, features, and functionality are owned by FanStock and are 
                                protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You are granted a limited, non-exclusive, non-transferable license to access and use the Service 
                                for your business purposes in accordance with these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                Your use of the Service is also governed by our Privacy Policy. Please review our 
                                <Link href="/privacy-policy" className="text-orange-500 hover:underline ml-1">
                                    Privacy Policy <ArrowUpRight className="w-4 h-4 inline" />
                                </Link>, which explains how we collect, use, and protect your information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                            <p className="text-gray-600 mb-4">
                                In no event shall FanStock, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                                be liable for any indirect, incidental, special, consequential, or punitive damages arising out of 
                                or in connection with your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
                            <p className="text-gray-600 mb-4">
                                We may terminate or suspend your account and bar access to the Service immediately, without prior 
                                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                                including but not limited to a breach of the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these Terms at any time. We will provide notice of any changes by 
                                posting the new Terms on this page and updating the Last updated date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                            <p className="text-gray-600 mb-4">
                                These Terms shall be governed and construed in accordance with the laws of Rwanda, without regard 
                                to its conflict of law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li>By email: <a href="mailto:legal@fanstock.com" className="text-orange-500 hover:underline">legal@fanstock.com</a></li>
                                <li>By visiting our <Link href="/contact-us" className="text-orange-500 hover:underline inline-flex items-center">
                                    contact page <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Link></li>
                                <li>By mail: Norrsken House Kigali, Kigali, Rwanda</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}