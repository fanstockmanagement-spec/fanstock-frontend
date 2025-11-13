"use client";

import { useState } from "react";
import { Search, Filter, Mail, User, ChevronDown, ChevronUp } from "lucide-react";
import { useContacts } from "@/app/components/hooks/useContacts";



export default function Inquiries() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);
    const { contacts, setContacts } = useContacts();
    const toggleInquiry = (id: number) => {
        setExpandedInquiry(expandedInquiry === id ? null : id);

        // Mark as read when expanded
        if (expandedInquiry !== id) {
            setContacts(contacts.map(contact =>
                contact.id === id ? { ...contact, read: true } : contact
            )); 
        }
    };


    const filteredInquiries = contacts.filter(contact => {
        const matchesSearch =
            contact.yourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.yourEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.yourSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.yourMessage.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || contact.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

   const getStatusBadge = (status: string = 'new') => {  // Add default value
    const statusMap: { [key: string]: { class: string; label: string } } = {
        "new": { 
            class: "bg-blue-100 text-blue-800",
            label: "New"
        },
        "in-progress": { 
            class: "bg-yellow-100 text-yellow-800",
            label: "In Progress"
        },
        "resolved": { 
            class: "bg-green-100 text-green-800",
            label: "Resolved"
        }
    };

    const statusInfo = statusMap[status.toLowerCase()] || { 
        class: 'bg-gray-100 text-gray-800',
        label: status || 'Unknown'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}`}>
            {statusInfo.label}
        </span>
    );
};

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Customer Inquiries</h1>
                    <p className="text-gray-400">Manage and respond to customer messages</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInquiries.length > 0 ? (
                                filteredInquiries.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className={`${!contact.read ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                                        onClick={() => toggleInquiry(contact.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center ${!contact.read ? 'ring-2 ring-orange-400' : ''}`}>
                                                    <User className="h-5 w-5 text-orange-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${!contact.read ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
                                                        {contact.yourName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{contact.yourEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm capitalize ${!contact.read ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>
                                                {contact.yourSubject}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {contact.yourMessage.substring(0, 60)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(contact.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-orange-500 hover:text-orange-700">
                                                {expandedInquiry === contact.id ? <ChevronUp /> : <ChevronDown />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Mail className="h-12 w-12 text-gray-300 mb-2" />
                                            <p className="text-sm">No inquiries found</p>
                                            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expanded View for Selected Inquiry */}
            {expandedInquiry && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm    ">
                    {(() => {
                        const inquiry = contacts.find(i => i.id === expandedInquiry);
                        if (!inquiry) return null;

                        return (
                            <>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 capitalize">{inquiry.yourSubject}</h2>
                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                            <span>{inquiry.yourName}</span>
                                            <span className="mx-2">•</span>
                                            <a href={`mailto:${inquiry.yourEmail}`} className="text-orange-500 hover:underline">
                                                {inquiry.yourEmail}
                                            </a>
                                            <span className="mx-2">•</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(inquiry.createdAt)}
                                        </span>
                                        {getStatusBadge(inquiry.status)}
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-line ">{inquiry.yourMessage}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Reply to inquiry</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <textarea
                                                rows={4}
                                                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Type your response here..."
                                                defaultValue=""
                                            />
                                        </div>
                                        <div className="flex items-center justify-end space-x-3">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                            >
                                                Save as Draft
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                            >
                                                Send Response
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}