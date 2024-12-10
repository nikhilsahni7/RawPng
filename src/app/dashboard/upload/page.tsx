import { Metadata } from "next";
import { UploadContent } from "@/components/upload/upload-content";

export const metadata: Metadata = {
  title: "Upload Dashboard",
  description: "Upload and manage your content",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <UploadContent />
    </div>
  );
}
