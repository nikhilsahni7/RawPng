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
      question: "Can I use Rawpng.com content for commercial purposes?",
      answer:
        "Yes, you can use our content for commercial purposes, including advertisements. However, attribution is required if possible.",
    },
    {
      question: "Do I need to credit Rawpng.com for personal use?",
      answer: "No, attribution is not required for personal use.",
    },
    {
      question: "Is it okay to modify the content before using it?",
      answer:
        "Yes, you can modify the content to suit your needs. However, ownership of the content remains with Rawpng.com, even after modifications.",
    },
    {
      question: "Why can’t I resell or redistribute the content?",
      answer:
        "Reselling or redistributing content, even with modifications, is strictly prohibited. This ensures that the content remains free and accessible to all users.",
    },
    {
      question: "What happens if I violate the terms?",
      answer:
        "Violations of our terms will result in immediate revocation of your license, IP bans, and potential legal action.",
    },
    {
      question: "What format should I use to attribute Rawpng.com?",
      answer:
        "You can follow any format that fits your design, as long as it visibly acknowledges Rawpng.com as the source.",
    },
    {
      question:
        "Is attribution necessary if I’m using content for advertisements?",
      answer: "Yes, attribution is required for advertisements, if possible.",
    },
    {
      question: "Can I use bots to download images in bulk?",
      answer:
        "No, the use of bots or automation to download content is prohibited. Violating this rule will lead to service termination for the associated IP address.",
    },
    {
      question: "Is there a limit on how many images I can download?",
      answer:
        "No, there’s currently no limit on downloads, but we encourage users to follow fair usage practices.",
    },
    {
      question: "Does modifying content transfer ownership to me?",
      answer:
        "No, modifying content does not transfer ownership. All content remains the intellectual property of Rawpng.com.",
    },
    {
      question: "How do I contact Rawpng.com for licensing inquiries?",
      answer:
        "For any questions or clarifications about licensing, you can contact us at contact@rawpng.com or via our contact page.",
    },
    {
      question:
        "Can I use Rawpng.com content for mobile app designs or software UI?",
      answer:
        "Yes, you can use Rawpng.com content for mobile apps or software UI, provided it complies with our licensing terms. Attribution is required for commercial use if possible.",
    },
    {
      question:
        "Are there restrictions on how many people in my organization can use the downloaded content?",
      answer:
        "No, there are no restrictions. However, the terms of use apply to everyone using the content, and redistribution is prohibited.",
    },
    {
      question: "Can I use Rawpng.com content in templates I plan to sell?",
      answer:
        "No, using content from Rawpng.com in templates or products for resale is strictly prohibited.",
    },
    {
      question:
        "Do I need to notify Rawpng.com if I use the content in a large-scale project?",
      answer:
        "No notification is required, but you must comply with our licensing terms. Attribution is appreciated when possible for commercial use.",
    },
    {
      question: "Do I need to create an account to download images?",
      answer:
        "No, you do not need an account. However, there are daily limitations on how many stock images you can download without logging in. All content is freely available for download.",
    },
    {
      question: "What file formats are available for download?",
      answer:
        "Our content is primarily focused on PNG format, however, we also offer JPG and EPS formats.",
    },
    {
      question: "Are there different resolutions available for the same image?",
      answer:
        "Currently, only one resolution is provided for each image, optimized for general use.",
    },
    {
      question: "What should I do if a download fails?",
      answer:
        "Please try refreshing the page or using a different browser. If the issue persists, contact us via contact@rawpng.com or the contact page.",
    },
    {
      question: "Can I upload my own designs or photos to Rawpng.com?",
      answer:
        "No, we do not allow contributors at this time. However, if you want to be a part of our ambitious team, feel free to reach out for future opportunities.",
    },
    {
      question: "Will you allow contributors in the future?",
      answer:
        "If you're passionate about being part of our ambitious team, we’d love to hear from you. Reach out to us for future opportunities!",
    },
    {
      question:
        "Can I use the content from Rawpng.com in international projects?",
      answer:
        "Yes, our content can be used in projects worldwide, provided you adhere to our licensing terms.",
    },
    {
      question:
        "What happens if I accidentally use your content inappropriately?",
      answer:
        "If this happens, please remove the content immediately and contact us for clarification to avoid further action.",
    },
    {
      question: "Do I have to pay for extended licenses in the future?",
      answer:
        "Currently, all content is free, and no extended licenses are needed. If this changes, we will update our terms and notify users.",
    },
    {
      question: "Does Rawpng.com monitor how I use downloaded content?",
      answer:
        "Currently, we do not accept contributions. However, if you're passionate about being part of our ambitious team, we’d love to hear from you. Reach out to us for future opportunities!",
    },
    {
      question: "How do I report bugs or issues with the website?",
      answer:
        "You can report any issues to contact@rawpng.com or through the contact page.",
    },
    {
      question: "What browsers are supported by Rawpng.com?",
      answer:
        "Rawpng.com is optimized for all major browsers, including Chrome, Firefox, Safari, and Edge.",
    },
    {
      question: "Do you have an API for developers to access the content?",
      answer:
        "Not at the moment, but this feature may be added in the future based on user demand.",
    },
    {
      question: "Will Rawpng.com remain free forever?",
      answer:
        "While all content is currently free, this may change in the future. Updates will be shared on the website.",
    },
    {
      question: "Are there plans to add premium or paid content?",
      answer:
        "We are considering adding premium content in the future, but no decisions have been finalized yet.",
    },
    {
      question: "How will I know if the terms or licensing rules change?",
      answer:
        "We will share updates via email. Make sure to subscribe or check your registered email for notifications about any changes.",
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
            <Link
              href="/contact"
              className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-blue-900">Contact Support</span>
            </Link>
            <a
              href="mailto:contact@rawpng.com"
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
