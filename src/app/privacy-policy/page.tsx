import { Metadata } from "next";
import { Shield, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
export const metadata: Metadata = {
  title: "Privacy Policy - Pngly",
  description: "Privacy Policy and data handling practices of Pngly",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Information We Collect",
      content: `We may collect the following types of information:
        • Personal Information: Information you provide directly through contact forms or email (e.g., name, email address)
        • Non-Personal Information: Data collected automatically through cookies, including IP addresses, browser types, and user behavior on the website`,
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: `We use the collected data to:
        • Provide and improve the website's functionality
        • Respond to user inquiries or feedback
        • Monitor website traffic and improve user experience`,
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: `We implement security measures to protect your data against unauthorized access, alteration, or disclosure. However, no method of online transmission is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Your Rights",
      content: `As a user, you have the right to:
        • Access or request a copy of your personal data
        • Request corrections or deletions of inaccurate or unnecessary data
        • Opt-out of cookie usage or data collection where applicable`,
    },
    {
      title: "Cookies and Tracking Technologies",
      content: `Rawpng.com uses cookies to enhance your browsing experience. Cookies help us understand user preferences and improve our services. By using our website, you consent to the use of cookies. You can disable cookies through your browser settings, though this may affect the website's functionality.`,
    },
    {
      title: "Sharing of Information",
      content: `We do not sell, trade, or share your personal information with third parties, except:
        • When required by law
        • To protect the rights and safety of Rawpng.com or its users
        • With service providers assisting in website functionality (e.g., hosting services)`,
    },
    {
      title: "Third-Party Links",
      content: `Rawpng.com may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies independently.`,
    },
    {
      title: "Children's Privacy",
      content: `Rawpng.com is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              How we handle and protect your information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-12">Effective Date: 2025-01-01</p>

          <p className="text-gray-600 mb-8">
            At Rawpng.com, we respect your privacy and are committed to
            protecting any personal information you may share with us. This
            Privacy Policy outlines how we collect, use, and protect your data
            when you use our website.
          </p>

          {sections.map((section, index) => (
            <section key={index} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                {section.icon && (
                  <div className="text-blue-600">{section.icon}</div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 m-0">
                  {section.title}
                </h2>
              </div>
              <div className={section.icon ? "pl-9" : ""}>
                <div className="text-gray-600 whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </section>
          ))}

          <section className="mt-12 pt-12 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about our Privacy Policy, please contact
              us at{" "}
              <a
                href="mailto:info@rawpng.com"
                className="text-blue-600 hover:text-blue-800"
              >
                info@rawpng.com
              </a>{" "}
              or through our{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
