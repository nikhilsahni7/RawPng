/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { signin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google authentication is not configured");
      return;
    }

    const redirectUri = encodeURIComponent(
      `${window.location.origin}/api/auth/callback/google`
    );
    const scope = encodeURIComponent("email profile");

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signin(email, password);
      toast.success("Signed in successfully");
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-600">
            Enter your details to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-500 stroke-[1.5]" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="pl-10 h-11 bg-gray-50/50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-500 stroke-[1.5]" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="pl-10 h-11 bg-gray-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px] stroke-[1.5]" />
                ) : (
                  <Eye className="h-[18px] w-[18px] stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue
                <ArrowRight className="h-4 w-4 stroke-[2]" />
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 relative hover:bg-gray-50/50 transition-colors duration-200"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <div className="absolute left-3 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700 font-medium">
              Continue with Google
            </span>
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
