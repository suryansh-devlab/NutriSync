import express from "express";
import "./config/redis.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "success", message: "NutriSync API is Live 🚀" });
});

export default app;
