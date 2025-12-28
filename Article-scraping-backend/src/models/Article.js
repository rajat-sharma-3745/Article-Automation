import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["original", "updated"],
      default: "original",
    },
    references: [
      {
        title: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", articleSchema);
