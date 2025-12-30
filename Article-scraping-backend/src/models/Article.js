import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      default: "Unknown",
    },
    date: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    updatedContent: String,
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
