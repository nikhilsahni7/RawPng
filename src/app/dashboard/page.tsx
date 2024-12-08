import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardContent } from "@/components/dashboard/content";

export const metadata: Metadata = {
  title: "Advanced Admin Dashboard",
  description: "Next-level admin dashboard for managing content and analytics",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/10">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <DashboardContent />
      </main>
    </div>
  );
}
