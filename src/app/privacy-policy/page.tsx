import { Metadata } from "next";
import { Shield, Lock, Eye, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Pngly",
  description: "Privacy Policy and data handling practices of Pngly",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Information We Collect",
      content: `We collect information that you provide directly to us when you:
        • Create an account or update your profile
        • Download resources from our platform
        • Subscribe to our newsletter
        • Contact our support team
        • Participate in surveys or promotions`,
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: `Your information helps us to:
        • Provide and maintain our services
        • Process your downloads and transactions
        • Send you important updates and notifications
        • Improve our platform and user experience
        • Respond to your comments and questions
        • Send marketing communications (with your consent)`,
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: `We implement appropriate security measures to protect your personal information:
        • Encryption of sensitive data
        • Regular security assessments
        • Secure data storage systems
        • Limited access to personal information
        • Regular security updates and monitoring`,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Your Rights",
      content: `You have the right to:
        • Access your personal data
        • Correct inaccurate data
        • Request deletion of your data
        • Object to data processing
        • Withdraw consent
        • Request data portability`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {sections.map((section, index) => (
            <section key={index} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-600">{section.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">
                  {section.title}
                </h2>
              </div>
              <div className="pl-9">
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
                href="mailto:privacy@pngly.com"
                className="text-blue-600 hover:text-blue-800"
              >
                privacy@pngly.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
