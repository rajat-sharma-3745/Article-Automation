import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});

export const fetchArticles = async () => {
  const res = await api.get("/articles");
  return res.data;
};
