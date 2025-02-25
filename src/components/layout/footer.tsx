"use client";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        throw new Error(data.error || "Failed to subscribe");
      }
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t">
      {/* Newsletter Section */}
      <div className="w-full bg-blue-600 text-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Stay in the Loop</h2>
            <p className="text-blue-100 max-w-2xl text-sm sm:text-base">
              Subscribe to our newsletter for exclusive updates, fresh
              resources, and creative inspiration.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="w-full max-w-md mt-4 sm:mt-6"
            >
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Logo Section */}
          <div className="col-span-2 lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                src="/Rawpnglogo(1).svg"
                alt="rawpng"
                width={140}
                height={45}
                className="rounded-md object-contain sm:w-[180px]"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {["About Us", "Contact", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Legal
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {["Privacy Policy", "Terms & Conditions", "License"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/ & | /g, "-")}`}
                      className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Connect With Us
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://x.com/rawpng1",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/rawpng_1/",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/rawpng",
                },
                {
                  icon: FaPinterest,
                  label: "Pinterest",
                  href: "https://in.pinterest.com/rawpng1/",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © {new Date().getFullYear()} rawpng. All rights reserved.
              {" | "}
              <Link
                href="/https://rawpng.com/sitemap-0.xml"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-gray-600">
                Made with ❤️ for creators
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
