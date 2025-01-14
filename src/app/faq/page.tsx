import { Metadata } from "next";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
export const metadata: Metadata = {
  title: "FAQ - rawpng",
  description:
    "Frequently asked questions about rawpng's services and platform",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What file formats does rawpng support?",
      answer:
        "rawpng supports multiple file formats including PNG, SVG, AI, and EPS. All images are available in high resolution and are optimized for both web and print use.",
    },
    {
      question: "Are the resources free to use?",
      answer:
        "Yes, all resources on rawpng are free to use for both personal and commercial projects. However, we recommend checking the specific license terms for each resource as some may require attribution.",
    },
    {
      question: "Can I modify and redistribute the resources?",
      answer:
        "Yes, you can modify our resources to suit your needs. However, you cannot redistribute the original or modified versions as standalone files. They must be part of a larger project or design.",
    },
    {
      question: "What's the maximum resolution available for downloads?",
      answer:
        "Most of our PNG images are available in resolutions up to 4000x4000 pixels. Vector files (SVG, AI) are scalable to any size without quality loss.",
    },
    {
      question: "Do I need to credit rawpng when using the resources?",
      answer:
        "While attribution is not required for most resources, we appreciate credits when possible. Some premium resources may require attribution - this will be clearly stated in the resource's license information.",
    },
    {
      question: "How often are new resources added?",
      answer:
        "We update our library daily with new resources. Premium members get early access to new content and exclusive resources not available to free users.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              Find answers to common questions about using rawpng
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <details className="group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              </details>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <a
              href="/contact"
              className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-blue-900">Contact Support</span>
            </a> */}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-blue-900">Contact Support</span>
            </Link>
            <a
              href="mailto:support@rawpng.com"
              className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-blue-900">Email Us</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
