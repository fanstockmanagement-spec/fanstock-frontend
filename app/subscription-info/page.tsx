"use client";

import { useState } from "react";
import { 
  CreditCard, 
  AlertTriangle, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionInfoPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    setIsContactFormOpen(false);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen text-sm">
     

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Alert */}
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Subscription Access Issue
              </h1>
              <p className="text-gray-600">
                It looks like your subscription has expired or there&apos;s an issue with your account access. 
                Don&apos;t worry - we&apos;re here to help you get back on track!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Status */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-orange-500" />
              Subscription Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-900">Status</span>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Expired
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Need to renew?</strong> Contact our support team to reactivate your subscription 
                and regain access to all features.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-orange-500" />
              Quick Actions
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => setIsContactFormOpen(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Support Team
              </button>

              <Link 
                href="/sign-in"
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5" />
                Try Signing In Again
              </Link>

              <Link 
                href="/"
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5" />
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            Help & Support
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get help via email within 24 hours
              </p>
              <a 
                href="mailto:fanstockmanagement@gmail.com"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                fanstockmanagement@gmail.com
              </a>
            </div>

            <div className="text-center p-4">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-3">
                Call us for immediate assistance
              </p>
              <a 
                href="tel:+1234567890"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="text-center p-4">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">
                Chat with our support team
              </p>
              <button 
                onClick={() => setIsContactFormOpen(true)}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Why can&apos;t I access my account?</h3>
              <p className="text-sm text-gray-600">
                This usually happens when your subscription has expired. Contact our support team to renew your subscription.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">How do I renew my subscription?</h3>
              <p className="text-sm text-gray-600">
                Reach out to our support team via email, phone, or live chat. We&apos;ll help you reactivate your account.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Will I lose my data?</h3>
              <p className="text-sm text-gray-600">
                No, your data is safe. Once you renew your subscription, you&apos;ll regain access to all your information.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">How long does reactivation take?</h3>
              <p className="text-sm text-gray-600">
                Account reactivation is usually instant once payment is processed. Contact support for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsContactFormOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}