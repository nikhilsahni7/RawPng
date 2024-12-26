import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["png", "vector", "image"],
    required: true,
    default: "png",
  },
  active: {
    type: Boolean,
    default: true,
  },
  showInNavbar: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes if needed
categorySchema.index({ name: 1 });
categorySchema.index({ type: 1 });
categorySchema.index({ active: 1 });
categorySchema.index({ showInNavbar: 1 });

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
