import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis("redis://localhost:6379");

app.post("/notifications", async (req, res) => {
  const payload = {
    title: req.body.title || "System Notification",
    createdAt: new Date().toISOString(),
  };

  const receivers = await publisher.publish(
    "notifications",
    JSON.stringify(payload),
  );

  res.json({ message: "Notifications sent to subscribers", receivers });
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
