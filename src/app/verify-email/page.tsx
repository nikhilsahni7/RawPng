"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Invalid verification link");
        router.push("/signin");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        toast.success("Email verified successfully");
        router.push("/signin");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Verification failed"
        );
        router.push("/signin");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto max-w-md py-16 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Verifying Your Email</h1>
      {isVerifying ? (
        <p>Please wait while we verify your email...</p>
      ) : (
        <p>Redirecting you to sign in...</p>
      )}
    </div>
  );
}
