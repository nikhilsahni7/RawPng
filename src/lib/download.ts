// lib/download.ts
export async function downloadImage(url: string, filename: string) {
  try {
    // Use proxy endpoint
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    return true;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}
