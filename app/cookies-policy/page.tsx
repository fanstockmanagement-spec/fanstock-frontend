import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CookiesPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookies Policy</h1>
                    <p className="text-lg">Last updated: November 13, 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="prose prose-orange max-w-none">
                    <p className="text-gray-600 mb-8">
                        This Cookies Policy explains what cookies are, how we use them, and your choices regarding cookies on the FanStock platform. 
                        Please read this policy carefully to understand our views and practices regarding cookies.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the site owners.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                            <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off.</li>
                                <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website.</li>
                                <li><strong>Functionality Cookies:</strong> These enable enhanced functionality and personalization.</li>
                                <li><strong>Analytics Cookies:</strong> We use these to understand how our platform is being used.</li>
                                <li><strong>Advertising Cookies:</strong> These are used to make advertising messages more relevant to you.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">session_id</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">Maintains your session on our platform</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_ga</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - Used to distinguish users</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 years</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gid</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - Used to distinguish users</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 hours</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">cookie_consent</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">Stores your cookie preferences</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 year</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                We may use various third-party services that may also use cookies, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                <li><strong>Google Analytics:</strong> To understand how visitors engage with our site.</li>
                                <li><strong>Hotjar:</strong> To better understand our users&apos; needs and optimize this service.</li>
                                <li><strong>Stripe:</strong> For secure payment processing.</li>
                                <li><strong>Intercom:</strong> For customer support and live chat functionality.</li>
                            </ul>
                            <p className="text-gray-600">
                                These third-party services have their own privacy policies and may use cookies and web beacons on our site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Cookie Choices</h2>
                            <p className="text-gray-600 mb-4">
                                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or by updating your browser settings.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.
                            </p>
                            <p className="text-gray-600">
                                To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">www.allaboutcookies.org</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to This Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page and updating the Last updated date at the top of this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about this Cookies Policy, please contact us:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li>By email: <a href="mailto:fanstockmanagement@gmail.com" className="text-orange-500 hover:underline">fanstockmanagement@gmail.com</a></li>
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