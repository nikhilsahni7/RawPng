import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
// import DashboardShell from "@/components/dashboard/shell";
import { DashboardContent } from "@/components/dashboard/content";

export const metadata: Metadata = {
  title: "Advanced Admin Dashboard",
  description: "Next-level admin dashboard for managing content and analytics",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader />

      <DashboardContent />
    </div>
  );
}
