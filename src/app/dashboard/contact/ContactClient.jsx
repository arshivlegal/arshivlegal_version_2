"use client";

import { useState } from "react";
import { Trash2, MessageSquare, Phone, Calendar } from "lucide-react";
import axios from "axios";

export default function ContactClient({ initialData }) {
  const [contacts, setContacts] = useState(initialData);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    setDeleting(id);
    try {
      await axios.delete(`/api/contact/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (error) {
      alert("Failed to delete contact.");
    } finally {
      setDeleting(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Inquiries Yet</h3>
        <p className="text-gray-500 max-w-sm">
          When a potential client fills out the contact form on your website, their message will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Details</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Inquiry Type</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* Date Column */}
                <td className="p-5 align-top">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium whitespace-nowrap">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(contact.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </div>
                </td>

                {/* Details Column */}
                <td className="p-5 align-top">
                  <p className="font-bold text-gray-900 capitalize">{contact.name}</p>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-sm text-[var(--accent-main)] hover:underline flex items-center gap-1.5 mt-1 w-fit font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" /> {contact.phone}
                  </a>
                </td>

                {/* Service Type Column */}
                <td className="p-5 align-top">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {contact.service}
                  </span>
                </td>

                {/* Message Column */}
                <td className="p-5 align-top w-1/3">
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {contact.description}
                  </p>
                </td>

                {/* Actions Column */}
                <td className="p-5 align-top text-right">
                  <button
                    onClick={() => handleDelete(contact._id)}
                    disabled={deleting === contact._id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}