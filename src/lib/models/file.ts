// lib/models/file.ts
export const CATEGORIES = [
  "Animals",
  "Buildings and Architecture",
  "Business",
  "Drinks",
  "The Environment",
  "States of Mind",
  "Food",
  "Graphic Resources",
  "Hobbies and Leisure",
  "Industry",
  "Landscapes",
  "Lifestyle",
  "People",
  "Plants and Flowers",
  "Culture and Religion",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "Transport",
  "Travel",
] as const;

export type Category = (typeof CATEGORIES)[number];
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
      enum: CATEGORIES,
      required: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    description: String,
    keywords: [String],
    dimensions: {
      width: Number,
      height: Number,
    },
  },
  { timestamps: true }
);

FileSchema.index({ title: "text" });

export const File =
  mongoose.models?.File || mongoose.model<IFile>("File", FileSchema);
