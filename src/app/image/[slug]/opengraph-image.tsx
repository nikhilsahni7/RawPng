import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stock Assets Image Preview";
export const size = {
  width: 1200,
  height: 630,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Image({ params }: { params: { slug: string } }) {
  const imageDetails = {
    title: "Happy Birthday Golden Balloon",
    type: "PNG",
  };

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
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h1 style={{ fontSize: 60, margin: 0 }}>{imageDetails.title}</h1>
          <p style={{ fontSize: 30, margin: 0, color: "#666" }}>
            Available as {imageDetails.type} on StockAssets
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
