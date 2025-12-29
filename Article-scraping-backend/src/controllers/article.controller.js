import Article from "../models/Article.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";

export const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.json(articles);
});


export const getArticleById = asyncHandler(async (req, res,next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return next(new ApiError("Article not found",404))
  }
  res.json(article);
});


export const updateArticle = asyncHandler(async (req, res,next) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!article) {
    return next(new ApiError("Article not found",404))
  }

  res.json(article);
});


export const deleteArticle = asyncHandler(async (req, res,next) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    return next(new ApiError("Article not found",404))
  }
  res.json({ message: "Article deleted successfully" });
});
