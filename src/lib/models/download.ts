// lib/models/download.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDownload extends Document {
  fileId: mongoose.Types.ObjectId;
  // Remove downloadedAt
}

const DownloadSchema = new Schema<IDownload>(
  {
    fileId: { type: Schema.Types.ObjectId, ref: "File", required: true },
    // Remove downloadedAt field
  },
  { timestamps: true }
);

DownloadSchema.index({ createdAt: 1 });
DownloadSchema.index({ fileId: 1 });

export const Download =
  mongoose.models?.Download ||
  mongoose.model<IDownload>("Download", DownloadSchema);
