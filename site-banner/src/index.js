import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "Welcom to my website!");

  res.json({ success: true });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);

  res.json({ exists: exists });
});

app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
