import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  const { id } = req.params;

  await redis.set(`user:${id}:json`, JSON.stringify(req.body));

  res.json({ message: "Saved as json" });
});

app.get("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const data = await redis.get(`user:${id}:json`);

  res.json({ data: data ? JSON.parse(data) : null });
});

app.post("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  await redis.hset(`user:${id}:hash`, req.body);

  res.json({ message: "Saved as hash." });
});

app.get("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const data = await redis.hgetall(`user:${id}:hash`);

  res.json({ data });
});
  
app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
