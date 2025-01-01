import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from "jsonwebtoken";
import { File as FileModel } from "@/lib/models/file";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { imageId, downloadToken } = await req.json();

    // Verify download token
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured");

    try {
      jwt.verify(downloadToken, process.env.JWT_SECRET);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid download token" },
        { status: 401 }
      );
    }

    // Get image details from database
    const image = await FileModel.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Generate short-lived signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: image.s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    return NextResponse.json({ downloadUrl: signedUrl });
  } catch (error) {
    console.error("Secure download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
