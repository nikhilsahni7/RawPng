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
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="inline-block mb-6 transform hover:scale-105 transition-transform duration-200"
            >
              <Image
                src="/Rawpnglogo(1).svg"
                alt="rawpng"
                width={180}
                height={60}
                className="rounded-md object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-md">
              Your go-to destination for high-quality stock free PNG images,
              vectors, and more. Download royalty free resources for your next
              project.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="text-sm text-muted-foreground/80 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 transition-all duration-200"></span>
                  License
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-6">
              Connect With Us
            </h3>
            <div className="flex space-x-5">
              <a
                href="https://x.com/rawpng1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 hover:text-gray-900 transform hover:scale-110 transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/rawpng_1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 hover:text-gray-900 transform hover:scale-110 transition-all duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/rawpng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 hover:text-gray-900 transform hover:scale-110 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://in.pinterest.com/rawpng1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 hover:text-gray-900 transform hover:scale-110 transition-all duration-200"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">
                Subscribe to our newsletter
              </h4>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground/80">
              © {new Date().getFullYear()} rawpng. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
