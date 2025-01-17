import { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "About Us - rawpng",
  description: "Learn more about rawpng and our mission",
};

export default function AboutPage() {
  const stats = [
    { number: "1M+", label: "Resources" },
    { number: "500K+", label: "Users" },
    { number: "50K+", label: "Downloads/day" },
    { number: "100+", label: "Countries" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                About rawpng
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Empowering creators with high-quality design resources
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="prose text-gray-600">
                <p>
                  Welcome to Rawpng.com, your ultimate destination for
                  high-quality, free stock images available in various formats.
                  We’re here to support your creative endeavors by providing
                  versatile and accessible graphic resources for personal and
                  commercial projects
                </p>
                <p>
                  At Rawpng.com, we believe that creativity should be accessible
                  to everyone, regardless of budget. Our platform offers a wide
                  range of stock images, including PNGs, JPEGs, and more.
                  Whether you&apos;re a graphic designer, marketer, or content
                  creator, our resources are designed to meet your need
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center text-blue-600 font-medium mt-6 hover:text-blue-800"
              >
                Get in touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/team.jpg"
                alt="rawpng team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
