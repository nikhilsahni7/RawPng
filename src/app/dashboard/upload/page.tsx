import { Metadata } from "next";
import { UploadTabs } from "@/components/upload/upload-tabs";

export const metadata: Metadata = {
  title: "Upload Content",
  description: "Upload your content via direct upload, CSV, or FTP",
};

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
        Upload Content
      </h1>
      <UploadTabs />
    </div>
  );
}
