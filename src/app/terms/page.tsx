import { Metadata } from "next";
import { Scale, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions - Pngly",
  description: "Terms and conditions for using Pngly's services",
};

export default function TermsPage() {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "General Terms",
      content: `Welcome to Rawpng.com! By accessing or using our platform, you agree to comply with these Terms and Conditions. Rawpng.com reserves the right to modify these terms at any time. Continued use of the website constitutes your acceptance of any changes.`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Licensing and Usage",
      content: `• All content on Rawpng.com is 100% free for personal use
        • Attribution is required for commercial use of any content
        • The content on Rawpng.com is strictly not for resale, even with modifications or changes`,
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "User Responsibilities",
      content: `• Users are prohibited from engaging in automated activities such as bots or scraping. Violation of this policy will result in the termination of service for the associated IP address
        • Users must use the content responsibly and within the guidelines provided`,
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Ownership of Content",
      content: `All content hosted on Rawpng.com is owned by Rawpng.com or its licensors. Users are granted a license to use the content per the terms outlined above but do not own the rights to the content.`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Contributors",
      content: `Rawpng.com currently does not allow contributors to upload or sell content on the platform.`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Payments",
      content: `Rawpng.com provides all its content free of charge at this time.`,
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Restrictions",
      content: `• Users may not redistribute or resell Rawpng.com's content
        • Automated access, scraping, or bot usage is strictly prohibited and will result in immediate action, including service termination`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Privacy Policy",
      content: `Rawpng.com respects your privacy. For more details on how we collect and handle your data, please refer to our Privacy Policy.`,
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Liability Disclaimer",
      content: `Rawpng.com shall not be held liable for any damages or losses resulting from the use or inability to use the website or its content. The website is provided "as-is" without any warranties.`,
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Governing Law",
      content: `These Terms and Conditions are governed by the laws of Haryana, India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Haryana, India.`,
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
                href="mailto:info@rawpng.com"
                className="text-blue-600 hover:text-blue-800"
              >
                info@rawpng.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
