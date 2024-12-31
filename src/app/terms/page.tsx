import { Metadata } from "next";
import { Scale, FileText, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions - Pngly",
  description: "Terms and conditions for using Pngly's services",
};

export default function TermsPage() {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: `By accessing and using Pngly, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "License and Usage",
      content: `• You may use our resources for personal and commercial projects
        • Attribution is required for certain premium resources
        • You may not redistribute resources as standalone files
        • You may not claim ownership of our resources
        • You may not sell or lease our resources
        • Modified versions must be part of a larger design`,
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Restrictions",
      content: `You agree not to:
        • Use our services for any illegal purposes
        • Attempt to gain unauthorized access to our systems
        • Upload malicious content or software
        • Interfere with other users' access to the service
        • Reverse engineer any part of our platform`,
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Intellectual Property",
      content: `• All resources remain the property of Pngly or our contributors
        • Our trademarks and brand features are protected
        • You retain rights to your modified works
        • Contributors retain rights as specified in their agreements
        • Unauthorized use may result in legal action`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              Please read these terms carefully before using our services
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
              Questions?
            </h2>
            <p className="text-gray-600">
              If you have any questions about our Terms & Conditions, please
              contact us at{" "}
              <a
                href="mailto:legal@pngly.com"
                className="text-blue-600 hover:text-blue-800"
              >
                legal@pngly.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
