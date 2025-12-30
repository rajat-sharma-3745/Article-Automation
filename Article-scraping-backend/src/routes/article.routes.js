import express from "express";
import {
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
