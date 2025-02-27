import { Metadata } from "next";
import { Scale, FileText, AlertCircle, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "License Agreement - rawpng",
  description: "License agreement for using rawpng's services and content",
};

export default function LicensePage() {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Permitted Use",
      content: `You may use content from Rawpng.com for:
        • Personal projects
        • Educational purposes
        • Social media posts
        • Commercial designs, including advertisements (with attribution, if possible)`,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Attribution for Commercial Use",
      content: `For commercial purposes, including advertisements, you are encouraged to provide appropriate credit to Rawpng.com. Attribution can follow any format that fits your design but should visibly acknowledge Rawpng.com as the source where possible.`,
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Prohibited Use",
      content: `You are strictly prohibited from:
        • Reselling or redistributing the content, even with modifications
        • Using content in sensitive or inappropriate contexts, including but not limited to:
          - Hate speech
          - Adult content
          - Illegal activities`,
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Ownership",
      content: `All content on Rawpng.com remains the intellectual property of Rawpng.com. Downloading or modifying content does not transfer ownership rights to the user.`,
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Enforcement of Terms",
      content: `Violations of this License Agreement will result in:
        • Immediate revocation of the license
        • Permanent IP bans from accessing Rawpng.com
        • Potential legal action for severe violations`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              License Agreement
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              Please review our license terms before using our content
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-12">
            Effective Date: {new Date().toLocaleDateString()}
          </p>

          <p className="text-gray-600 mb-8">
            This License Agreement applies to all content available on
            Rawpng.com. By downloading or using any content from the website,
            you agree to the terms outlined below:
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              Contact Information
            </h2>
            <p className="text-gray-600">
              For questions or clarifications about this License Agreement,
              please contact us:
            </p>
            <ul className="text-gray-600 mt-4">
              <li>
                Email:{" "}
                <a
                  href="mailto:contact@rawpng.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  contact@rawpng.com
                </a>
              </li>
              <li>
                Visit our{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Contact Page
                </Link>{" "}
                for more ways to reach us
              </li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
