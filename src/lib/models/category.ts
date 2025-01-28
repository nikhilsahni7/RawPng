import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["png", "vector", "image"],
    required: true,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
  showInNavbar: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for frequently accessed fields
categorySchema.index({ active: 1, showInNavbar: 1, type: 1 });

// Add TTL index for caching
categorySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 3600 }); // 1 hour

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
