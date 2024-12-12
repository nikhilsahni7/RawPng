// app/api/download/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    const contentDisposition = `attachment; filename="${url.split("/").pop()}"`;

    // Stream the response
    const body = await response.blob();

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": contentDisposition,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
