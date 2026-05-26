import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || `redis://localhost:6379`);

app.get("/", (req, res) => {
  res.send(
    `<a href="/redis">Redis check</a><br><a href="/mongo">Mongo check</a>`,
  );
});

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

app.get("/mongo", async (req, res) => {
  const url = process.env.MONGO_URL || `mongodb://localhost:27017/redis-server`;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }

  res.json({
    mongo: "connected",
    database: mongoose.connection.db.databaseName,
  });
});

app.listen(3000, (req, res) => {
  console.log(`server is running on http://localhost:3000`);
});
