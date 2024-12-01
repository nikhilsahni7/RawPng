"use client";

import { DownloadChart } from "@/components/dashboard/download-chart";
import { ImageGrid } from "@/components/gallery/image-grid";

export function DashboardContent() {
  return (
    <div className="grid gap-6">
      <DownloadChart />

      <ImageGrid />
    </div>
  );
}
