"use client";
import { useEffect, useState } from "react";
import { Mail, User, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ContactInfo {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactInfo() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Contact Submissions
        </h1>
        <p className="mt-2 text-gray-600">
          View and manage all contact form submissions
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Unique Senders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(contacts.map((contact) => contact.email)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Latest Message
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.length > 0
                  ? format(new Date(contacts[0].createdAt), "MMM d, yyyy")
                  : "No messages"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {contact.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-blue-600"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <p className="text-gray-900">{contact.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Message</p>
                <p className="text-gray-900 line-clamp-3">{contact.message}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">
                  Sent on{" "}
                  {format(
                    new Date(contact.createdAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No messages yet
          </h3>
          <p className="mt-2 text-gray-500">
            When you receive contact form submissions, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
