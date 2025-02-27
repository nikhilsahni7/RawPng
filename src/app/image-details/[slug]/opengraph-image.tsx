// app/image/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function OpenGraphImage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch image details
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/images/${params.id}`
  );
  const imageDetails = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <h1 style={{ fontSize: 60, margin: 0 }}>{imageDetails.title}</h1>
          <p style={{ fontSize: 30, margin: 0, color: "#666" }}>
            Available as {imageDetails.fileType} on Pingly
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
