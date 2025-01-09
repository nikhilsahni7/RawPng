import { Metadata } from "next";
import Image from "next/image";
import { Users, Target, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
export const metadata: Metadata = {
  title: "About Us - Pngly",
  description: "Learn more about Pngly and our mission",
};

export default function AboutPage() {
  const stats = [
    { number: "1M+", label: "Resources" },
    { number: "500K+", label: "Users" },
    { number: "50K+", label: "Downloads/day" },
    { number: "100+", label: "Countries" },
  ];

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Quality First",
      description:
        "We ensure every resource meets our high-quality standards before being added to our platform.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description:
        "Our community of designers and creators helps shape the future of Pngly.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from customer support to resource curation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Pngly
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose text-gray-600">
              <p>
                Founded in 2020, Pngly started with a simple mission: to provide
                designers and creators with high-quality resources that make
                their work easier and more efficient.
              </p>
              <p>
                Today, we&apos;re proud to serve a global community of creators,
                offering millions of carefully curated resources that help bring
                creative visions to life.
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
              alt="Pngly team"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="text-blue-600 flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
