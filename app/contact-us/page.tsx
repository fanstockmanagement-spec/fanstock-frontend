"use client";

import { Mail, Phone, MapPin, Linkedin, Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { NavigationBar } from "../components/navigation-bar";
import Footer from "../components/footer";
import Image from "next/image";
import { useContacts } from "../components/hooks/useContacts";
import { Spinner } from '@radix-ui/themes';
import { TriangleRightIcon } from '@radix-ui/react-icons';

const teamMembers = [
    {
        name: "Fadga Dahaba Bashir",
        role: "Lead Developer & Co-founder",
        bio: "Full-stack developer with 4+ years of experience in building scalable web applications. Passionate about creating seamless user experiences.",
        email: "fadgadahababashirdev@gmail.com",
        linkedin: "https://www.linkedin.com/in/fadga-dahaba-a43445381/",
        github: "https://github.com/fadgadahababashirdev",
        image: "/fadga_bashir.jpg"
    },
    {
        name: "Pascal Niringiyimana",
        role: "Product Designer & Co-founder",
        bio: "UX/UI designer with a keen eye for detail and a passion for creating intuitive interfaces that solve real user problems.",
        email: "pascalniri@gmail.com",
        linkedin: "https://www.linkedin.com/in/pascal-niringiyimana-59a324295/?isSelfProfile=true",
        github: "https://github.com/pascalniri",
        image: "/PXL_20250215_133345332~4 (2).jpg"
    },

];

export default function ContactUs() {

    const { register, handleSubmit, formState: { errors }, onSubmit, isLoading } = useContacts();

    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            <NavigationBar />
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
                    <p className="max-w-3xl mx-auto">
                        Have questions about our platform or interested in a demo? Our team is here to help you transform your inventory management.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                        <p className="text-gray-600 mb-4">We&apos;ll get back to you within 24 hours</p>
                        <a href="mailto:fanstockmanagement@gmail.com" className="text-orange-500 hover:underline">
                            fanstockmanagement@gmail.com
                        </a>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                        <p className="text-gray-600 mb-4">Mon-Fri from 9am to 5pm CAT</p>
                        <a href="tel:+250793366074" className="text-blue-500 hover:underline">
                            +250 793 366 074
                        </a>
                    </motion.div>
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                        <p className="text-gray-600 mb-4">Mon-Fri from 9am to 5pm CAT</p>
                        <a href="https://wa.me/250793366074" className="text-blue-500 hover:underline">
                            +250 793 366 074
                        </a>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                        <p className="text-gray-600">Norrsken House Kigali</p>
                        <p className="text-gray-600">Kigali, Rwanda</p>
                    </motion.div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-8">Send Us a Message</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register('yourName')}
                                        className="w-full bg-white px-3 py-2 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none" />
                                    {errors.yourName && <p className="text-red-500 mt-1 text-xs">{errors.yourName.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('yourEmail')}
                                        className="w-full bg-white px-3 py-2 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                    />
                                    {errors.yourEmail && <p className="text-red-500 mt-1 text-xs">{errors.yourEmail.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    {...register('yourSubject')}
                                    className="w-full bg-white px-3 py-2 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                >
                                    <option value="Demo Request">Demo Request</option>
                                    <option value="Sales Inquiry">Sales Inquiry</option>
                                    <option value="Support">Support</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.yourSubject && <p className="text-red-500 mt-1 text-xs">{errors.yourSubject.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Message *
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    {...register('yourMessage')}
                                    className="w-full bg-white px-3 py-2 border border-gray-200 focus:border-1 focus:border-orange-500 rounded-md transition-all duration-200 outline-none"
                                />
                                {errors.yourMessage && <p className="text-red-500 mt-1 text-xs">{errors.yourMessage.message}</p>}
                            </div>

                            <div className="text-center w-full flex items-center justify-center mt-5">
                                <button
                                    className="w-[200px] h-10 rounded-md flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 font-semibold hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    {isLoading ?
                                        <Spinner />
                                        :
                                        <span className='flex items-center gap-2'>
                                            Send Message <TriangleRightIcon />
                                        </span>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Team Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                        We&apos;re a passionate team of developers, designers, and product experts dedicated to revolutionizing inventory management for shoe retailers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                                    <Image src={member.image} alt={member.name} width={100} height={100} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-orange-500 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                                <div className="flex justify-center space-x-3">
                                    <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-orange-500">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                    {member.linkedin && (
                                        <a href={member.linkedin} className="text-gray-400 hover:text-blue-600">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.github && (
                                        <a href={member.github} className="text-gray-400 hover:text-gray-700">
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Inventory Management?</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        Schedule a demo today and see how FanStock can help you streamline your operations and grow your business&apos;.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="#contact-form"
                            className="px-6 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Schedule a Demo
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}