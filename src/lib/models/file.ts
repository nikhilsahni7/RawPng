// lib/models/file.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  cloudFrontUrl: string;
  category: string;
  title: string;
  description?: string;
  keywords: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    cloudFrontUrl: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    description: String,
    keywords: [String],
    dimensions: {
      width: Number,
      height: Number,
    },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
FileSchema.index({ title: "text", description: "text", keywords: "text" });
FileSchema.index({ createdAt: -1 });
FileSchema.index({ downloads: -1 });
FileSchema.index({ fileType: 1 });

export const File =
  mongoose.models?.File || mongoose.model<IFile>("File", FileSchema);
